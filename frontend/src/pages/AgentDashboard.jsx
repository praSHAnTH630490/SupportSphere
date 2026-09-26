import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { authenticatedFetch } from "../services/api";

function AgentDashboard() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ticketFilter, setTicketFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await authenticatedFetch("/tickets");
      const data = await response.json();

      setTickets(data);
    } catch (error) {
      console.error("Agent dashboard error:", error);
      setError(error.message || "Failed to load assigned tickets");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // STATUS COUNTS
  // =========================

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "OPEN"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "IN_PROGRESS"
  ).length;

  const waitingTickets = tickets.filter(
    (ticket) => ticket.status === "WAITING_FOR_CUSTOMER"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) =>
      ticket.status === "RESOLVED" ||
      ticket.status === "CLOSED"
  ).length;

  // =========================
  // PRIORITY COUNTS
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
  // DASHBOARD CARD NAVIGATION
  // =========================

  const openTicketsPage = (
    status = null,
    priority = null
  ) => {
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
  // STATUS FILTER
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
        <h1>Agent Dashboard</h1>
        <p>Welcome to SupportSphere Agent Portal</p>
      </div>

      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <p>Loading assigned tickets...</p>
      )}

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <p style={{ color: "red" }}>
          {error}
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
              onClick={() => openTicketsPage()}
            >
              <h3>Total Assigned</h3>
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
              ASSIGNED TICKETS
          ========================= */}

          <div className="recent-tickets">

            <h2>Assigned Tickets</h2>

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
                EMPTY RESULT
            ========================= */}

            {filteredTickets.length === 0 ? (

              <p>
                No tickets found for this filter.
              </p>

            ) : (

              <table className="ticket-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredTickets
                    .slice(0, 5)
                    .map((ticket) => (

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

                    ))}

                </tbody>

              </table>

            )}

          </div>

        </>
      )}

    </DashboardLayout>
  );
}

export default AgentDashboard;