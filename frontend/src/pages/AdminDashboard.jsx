import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { authenticatedFetch } from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [agentsLoading, setAgentsLoading] = useState(true);

  const [error, setError] = useState("");
  const [assignmentError, setAssignmentError] = useState("");

  const [assigningTicketId, setAssigningTicketId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [ticketFilter, setTicketFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);

  const ticketsPerPage = 5;

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    loadTickets();
    loadAgents();
  }, []);

  // =========================
  // RESET PAGINATION
  // =========================

  useEffect(() => {
    setCurrentPage(1);
  }, [ticketFilter, priorityFilter]);

  // =========================
  // LOAD TICKETS
  // =========================

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await authenticatedFetch("/tickets");
      const data = await response.json();

      setTickets(data);
    } catch (error) {
      console.error("Admin dashboard error:", error);

      setError(
        error.message || "Failed to load tickets"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD AGENTS
  // =========================

  const loadAgents = async () => {
    try {
      setAgentsLoading(true);

      const response = await authenticatedFetch("/agents");
      const data = await response.json();

      console.log("Agents response:", data);

      setAgents(data);
    } catch (error) {
      console.error("Agents loading error:", error);

      setAssignmentError(
        error.message || "Failed to load agents"
      );
    } finally {
      setAgentsLoading(false);
    }
  };

  // =========================
  // REFRESH DASHBOARD
  // =========================

  const refreshDashboard = async () => {
    try {
      setRefreshing(true);
      setError("");
      setAssignmentError("");

      await Promise.all([
        loadTickets(),
        loadAgents(),
      ]);
    } catch (error) {
      console.error(
        "Dashboard refresh error:",
        error
      );

      setError(
        error.message || "Failed to refresh dashboard"
      );
    } finally {
      setRefreshing(false);
    }
  };

  // =========================
  // ASSIGN AGENT
  // =========================

  const handleAssignAgent = async (
    ticketId,
    agentId
  ) => {
    if (!agentId) {
      return;
    }

    try {
      setAssigningTicketId(ticketId);
      setAssignmentError("");

      const response = await authenticatedFetch(
        `/tickets/${ticketId}/assign/${agentId}`,
        {
          method: "PUT",
        }
      );

      const updatedTicket = await response.json();

      console.log(
        "Assigned ticket:",
        updatedTicket
      );

      setTickets((previousTickets) =>
        previousTickets.map((ticket) =>
          ticket.ticketId === ticketId
            ? updatedTicket
            : ticket
        )
      );
    } catch (error) {
      console.error(
        "Ticket assignment error:",
        error
      );

      setAssignmentError(
        error.message ||
          "Failed to assign ticket"
      );
    } finally {
      setAssigningTicketId(null);
    }
  };

  // =========================
  // TICKET STATISTICS
  // =========================

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "OPEN"
  ).length;

  const assignedTickets = tickets.filter(
    (ticket) => ticket.status === "ASSIGNED"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "IN_PROGRESS"
  ).length;

  const waitingTickets = tickets.filter(
    (ticket) =>
      ticket.status === "WAITING_FOR_CUSTOMER"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) =>
      ticket.status === "RESOLVED" ||
      ticket.status === "CLOSED"
  ).length;

  // =========================
  // PRIORITY STATISTICS
  // =========================

  const lowPriorityTickets = tickets.filter(
    (ticket) => ticket.priority === "LOW"
  ).length;

  const mediumPriorityTickets = tickets.filter(
    (ticket) => ticket.priority === "MEDIUM"
  ).length;

  const highPriorityTickets = tickets.filter(
    (ticket) => ticket.priority === "HIGH"
  ).length;

  const urgentPriorityTickets = tickets.filter(
    (ticket) => ticket.priority === "URGENT"
  ).length;

  // =========================
  // AGENT STATISTICS
  // =========================

  const totalAgents = agents.length;

  const availableAgents = agents.filter(
    (agent) =>
      agent.availabilityStatus === "AVAILABLE"
  ).length;

  const busyAgents = agents.filter(
    (agent) =>
      agent.availabilityStatus === "BUSY"
  ).length;

  const offlineAgents = agents.filter(
    (agent) =>
      agent.availabilityStatus === "OFFLINE"
  ).length;

  // =========================
  // DASHBOARD FILTER
  // =========================

  const filteredTickets = tickets.filter((ticket) => {
    const statusMatches =
      ticketFilter === "ALL" ||
      ticket.status === ticketFilter;

    const priorityMatches =
      priorityFilter === "ALL" ||
      ticket.priority === priorityFilter;

    return statusMatches && priorityMatches;
  });

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(
    filteredTickets.length / ticketsPerPage
  );

  const startIndex =
    (currentPage - 1) * ticketsPerPage;

  const currentTickets = filteredTickets.slice(
    startIndex,
    startIndex + ticketsPerPage
  );

  // =========================
  // REDIRECT TO TICKETS
  // =========================

  const openTicketsPage = (status = null, priority = null) => {
    const params = new URLSearchParams();

    if (status) {
      params.set("status", status);
    }

    if (priority) {
      params.set("priority", priority);
    }

    const queryString = params.toString();

    navigate(
      queryString
        ? `/tickets?${queryString}`
        : "/tickets"
    );
  };

  // =========================
  // STATUS BADGE
  // =========================

  const getStatusClass = (status) => {
    switch (status) {
      case "OPEN":
        return "status-badge status-open";

      case "ASSIGNED":
        return "status-badge status-assigned";

      case "IN_PROGRESS":
        return "status-badge status-progress";

      case "WAITING_FOR_CUSTOMER":
        return "status-badge status-waiting";

      case "RESOLVED":
        return "status-badge status-resolved";

      case "CLOSED":
        return "status-badge status-closed";

      default:
        return "status-badge";
    }
  };

  // =========================
  // PRIORITY BADGE
  // =========================

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "LOW":
        return "priority-badge priority-low";

      case "MEDIUM":
        return "priority-badge priority-medium";

      case "HIGH":
        return "priority-badge priority-high";

      case "URGENT":
        return "priority-badge priority-urgent";

      default:
        return "priority-badge";
    }
  };

  return (
    <DashboardLayout>

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-header">

        <h1>Admin Dashboard</h1>

        <p>
          Welcome to SupportSphere Administration
        </p>

      </div>

      {/* =========================
          REFRESH
      ========================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "15px",
        }}
      >
        <button
          type="button"
          onClick={refreshDashboard}
          disabled={refreshing}
        >
          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>
      </div>

      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <p>Loading dashboard...</p>
      )}

      {/* =========================
          ERRORS
      ========================= */}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {assignmentError && (
        <p style={{ color: "red" }}>
          {assignmentError}
        </p>
      )}

      {!loading && !error && (
        <>

          {/* =========================
              TICKET STATISTICS
          ========================= */}

          <div className="dashboard-cards">

            <button
              type="button"
              className="dashboard-card dashboard-card-link"
              onClick={() =>
                openTicketsPage()
              }
            >
              <h3>Total Tickets</h3>
              <p>{totalTickets}</p>
            </button>

            <button
              type="button"
              className="dashboard-card dashboard-card-link"
              onClick={() =>
                openTicketsPage("OPEN")
              }
            >
              <h3>Open</h3>
              <p>{openTickets}</p>
            </button>

            <button
              type="button"
              className="dashboard-card dashboard-card-link"
              onClick={() =>
                openTicketsPage("ASSIGNED")
              }
            >
              <h3>Assigned</h3>
              <p>{assignedTickets}</p>
            </button>

            <button
              type="button"
              className="dashboard-card dashboard-card-link"
              onClick={() =>
                openTicketsPage("IN_PROGRESS")
              }
            >
              <h3>In Progress</h3>
              <p>{inProgressTickets}</p>
            </button>

            <button
              type="button"
              className="dashboard-card dashboard-card-link"
              onClick={() =>
                openTicketsPage(
                  "WAITING_FOR_CUSTOMER"
                )
              }
            >
              <h3>Waiting</h3>
              <p>{waitingTickets}</p>
            </button>

            <button
              type="button"
              className="dashboard-card dashboard-card-link"
              onClick={() =>
                openTicketsPage("RESOLVED")
              }
            >
              <h3>Resolved</h3>
              <p>{resolvedTickets}</p>
            </button>

          </div>

          {/* =========================
              PRIORITY STATISTICS
          ========================= */}

          <div className="dashboard-cards">

            <button
              type="button"
              className="dashboard-card dashboard-card-link"
              onClick={() =>
                openTicketsPage(
                  null,
                  "LOW"
                )
              }
            >
              <h3>Low Priority</h3>
              <p>{lowPriorityTickets}</p>
            </button>

            <button
              type="button"
              className="dashboard-card dashboard-card-link"
              onClick={() =>
                openTicketsPage(
                  null,
                  "MEDIUM"
                )
              }
            >
              <h3>Medium Priority</h3>
              <p>{mediumPriorityTickets}</p>
            </button>

            <button
              type="button"
              className="dashboard-card dashboard-card-link"
              onClick={() =>
                openTicketsPage(
                  null,
                  "HIGH"
                )
              }
            >
              <h3>High Priority</h3>
              <p>{highPriorityTickets}</p>
            </button>

            <button
              type="button"
              className="dashboard-card dashboard-card-link"
              onClick={() =>
                openTicketsPage(
                  null,
                  "URGENT"
                )
              }
            >
              <h3>Urgent Priority</h3>
              <p>{urgentPriorityTickets}</p>
            </button>

          </div>

          {/* =========================
              AGENT STATISTICS
          ========================= */}

          <div className="dashboard-cards">

            <div
              className="dashboard-card dashboard-card-link"
              role="button"
              tabIndex={0}
              onClick={() => navigate("/admin/agents")}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  navigate("/admin/agents");
                }
              }}
            >
              <h3>Total Agents</h3>
              <p>{totalAgents}</p>
            </div>

            <div
              className="dashboard-card dashboard-card-link"
              role="button"
              tabIndex={0}
              onClick={() =>
                navigate("/admin/agents?status=AVAILABLE")
              }
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  navigate("/admin/agents?status=AVAILABLE");
                }
              }}
            >
              <h3>Available Agents</h3>
              <p>{availableAgents}</p>
            </div>

            <div
              className="dashboard-card dashboard-card-link"
              role="button"
              tabIndex={0}
              onClick={() =>
                navigate("/admin/agents?status=BUSY")
              }
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  navigate("/admin/agents?status=BUSY");
                }
              }}
            >
              <h3>Busy Agents</h3>
              <p>{busyAgents}</p>
            </div>

            <div
              className="dashboard-card dashboard-card-link"
              role="button"
              tabIndex={0}
              onClick={() =>
                navigate("/admin/agents?status=OFFLINE")
              }
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  navigate("/admin/agents?status=OFFLINE");
                }
              }}
            >
              <h3>Offline Agents</h3>
              <p>{offlineAgents}</p>
            </div>

          </div>

          {/* =========================
              RECENT TICKETS
          ========================= */}

          <div className="recent-tickets">

            <h2>Recent Tickets</h2>

            {/* =========================
                STATUS FILTERS
            ========================= */}

            <div className="ticket-filters">

              <button
                className={`filter-button ${
                  ticketFilter === "ALL"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setTicketFilter("ALL")
                }
              >
                All
              </button>

              <button
                className={`filter-button ${
                  ticketFilter === "OPEN"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setTicketFilter("OPEN")
                }
              >
                Open
              </button>

              <button
                className={`filter-button ${
                  ticketFilter === "ASSIGNED"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setTicketFilter("ASSIGNED")
                }
              >
                Assigned
              </button>

              <button
                className={`filter-button ${
                  ticketFilter === "IN_PROGRESS"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setTicketFilter("IN_PROGRESS")
                }
              >
                In Progress
              </button>

              <button
                className={`filter-button ${
                  ticketFilter ===
                  "WAITING_FOR_CUSTOMER"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setTicketFilter(
                    "WAITING_FOR_CUSTOMER"
                  )
                }
              >
                Waiting
              </button>

              <button
                className={`filter-button ${
                  ticketFilter === "RESOLVED"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setTicketFilter("RESOLVED")
                }
              >
                Resolved
              </button>

              <button
                className={`filter-button ${
                  ticketFilter === "CLOSED"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setTicketFilter("CLOSED")
                }
              >
                Closed
              </button>

            </div>

            {/* =========================
                PRIORITY FILTERS
            ========================= */}

            <div className="ticket-filters">

              <button
                className={`filter-button ${
                  priorityFilter === "ALL"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setPriorityFilter("ALL")
                }
              >
                All Priorities
              </button>

              <button
                className={`filter-button ${
                  priorityFilter === "LOW"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setPriorityFilter("LOW")
                }
              >
                Low
              </button>

              <button
                className={`filter-button ${
                  priorityFilter === "MEDIUM"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setPriorityFilter("MEDIUM")
                }
              >
                Medium
              </button>

              <button
                className={`filter-button ${
                  priorityFilter === "HIGH"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setPriorityFilter("HIGH")
                }
              >
                High
              </button>

              <button
                className={`filter-button ${
                  priorityFilter === "URGENT"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setPriorityFilter("URGENT")
                }
              >
                Urgent
              </button>

            </div>

            {/* =========================
                TICKET TABLE
            ========================= */}

            {filteredTickets.length === 0 ? (

              <p>
                No tickets found for this filter.
              </p>

            ) : (

              <>

                <table className="ticket-table">

                  <thead>

                    <tr>
                      <th>ID</th>
                      <th>Subject</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Assign Agent</th>
                      <th>Action</th>
                    </tr>

                  </thead>

                  <tbody>

                    {currentTickets.map(
                      (ticket) => (

                        <tr
                          key={ticket.ticketId}
                        >

                          <td>
                            #{ticket.ticketId}
                          </td>

                          <td>
                            {ticket.subject}
                          </td>

                          <td>

                            <span
                              className={getStatusClass(
                                ticket.status
                              )}
                            >
                              {ticket.status}
                            </span>

                          </td>

                          <td>

                            <span
                              className={getPriorityClass(
                                ticket.priority
                              )}
                            >
                              {ticket.priority}
                            </span>

                          </td>

                          <td>

                            {agentsLoading ? (

                              <span>
                                Loading agents...
                              </span>

                            ) : agents.length === 0 ? (

                              <span>
                                No agents available
                              </span>

                            ) : (

                              <select
                                value={
                                  ticket.agent?.agentId ||
                                  ""
                                }
                                onChange={(event) =>
                                  handleAssignAgent(
                                    ticket.ticketId,
                                    event.target.value
                                  )
                                }
                                disabled={
                                  assigningTicketId ===
                                  ticket.ticketId
                                }
                              >

                                <option value="">
                                  Select Agent
                                </option>

                                {agents.map(
                                  (agent) => (

                                    <option
                                      key={
                                        agent.agentId
                                      }
                                      value={
                                        agent.agentId
                                      }
                                    >
                                      {agent.employeeCode ||
                                        `Agent ${agent.agentId}`}
                                    </option>

                                  )
                                )}

                              </select>

                            )}

                            {assigningTicketId ===
                              ticket.ticketId && (

                              <small>
                                Assigning...
                              </small>

                            )}

                          </td>

                          <td>

                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/tickets/${ticket.ticketId}`
                                )
                              }
                            >
                              View
                            </button>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

                {/* =========================
                    PAGINATION
                ========================= */}

                {totalPages > 1 && (

                  <div className="ticket-pagination">

                    <button
                      onClick={() =>
                        setCurrentPage(
                          (page) => page - 1
                        )
                      }
                      disabled={
                        currentPage === 1
                      }
                    >
                      Previous
                    </button>

                    <span>
                      Page {currentPage} of{" "}
                      {totalPages}
                    </span>

                    <button
                      onClick={() =>
                        setCurrentPage(
                          (page) => page + 1
                        )
                      }
                      disabled={
                        currentPage === totalPages
                      }
                    >
                      Next
                    </button>

                  </div>

                )}

              </>

            )}

          </div>

        </>

      )}

    </DashboardLayout>
  );
}

export default AdminDashboard;