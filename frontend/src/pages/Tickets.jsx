import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { authenticatedFetch } from "../services/api";

function Tickets() {

console.log("URL:", window.location.href);
console.log("STATUS:", new URLSearchParams(window.location.search).get("status"));

  const [searchParams] = useSearchParams();

  const customerId = searchParams.get("customerId");
  const urlStatus = searchParams.get("status");
  const urlPriority = searchParams.get("priority");

  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



  // =========================
  // SEARCH AND FILTERS
  // =========================

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState(
    urlStatus || "ALL"
  );

  const [priorityFilter, setPriorityFilter] = useState(
    urlPriority || "ALL"
  );

  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    loadTickets();
    loadCategories();
  }, [customerId]);

  // =========================
  // APPLY URL FILTERS
  // =========================

  useEffect(() => {
    setStatusFilter(urlStatus || "ALL");
    setPriorityFilter(urlPriority || "ALL");
  }, [urlStatus, urlPriority]);

  // =========================
  // LOAD TICKETS
  // =========================

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const endpoint = customerId
        ? `/tickets/customer/${customerId}`
        : "/tickets";

      const response = await authenticatedFetch(endpoint);
      const data = await response.json();

      console.log("Tickets response:", data);

      setTickets(data);
    } catch (error) {
      console.error("Tickets error:", error);

      setError(
        error.message || "Failed to load tickets"
      );
    } finally {
      setLoading(false);
    }
  };



  // =========================
  // LOAD CATEGORIES
  // =========================

  const loadCategories = async () => {
    try {
      const response =
        await authenticatedFetch("/categories");

      const data = await response.json();

      console.log("Categories response:", data);

      setCategories(data);
    } catch (error) {
      console.error("Categories error:", error);
    }
  };

  // =========================
  // STATUS CSS
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
  // PRIORITY CSS
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

  // =========================
  // AGENT NAME
  // =========================

  const getAgentName = (ticket) => {
    if (!ticket.assignedAgent) {
      return "Not assigned";
    }

    if (ticket.assignedAgent.user?.name) {
      return ticket.assignedAgent.user.name;
    }

    if (ticket.assignedAgent.employeeCode) {
      return ticket.assignedAgent.employeeCode;
    }

    if (ticket.assignedAgent.agentId) {
      return `Agent #${ticket.assignedAgent.agentId}`;
    }

    return "Assigned";
  };

  // =========================
  // FILTER TICKETS
  // =========================

  const filteredTickets = tickets.filter((ticket) => {
    const search = searchTerm.toLowerCase();

    // Search
    const matchesSearch =
      ticket.subject
        ?.toLowerCase()
        .includes(search) ||
      ticket.description
        ?.toLowerCase()
        .includes(search) ||
      String(ticket.ticketId).includes(search);

    // Status
    //
    // IMPORTANT:
    // Admin Dashboard "Resolved" count includes
    // both RESOLVED and CLOSED tickets.
    //
    const matchesStatus =
      statusFilter === "ALL" ||
      ticket.status === statusFilter ||
      (
        statusFilter === "RESOLVED" &&
        ticket.status === "CLOSED"
      );

    // Priority
    const matchesPriority =
      priorityFilter === "ALL" ||
      ticket.priority === priorityFilter;

    // Category
    const matchesCategory =
      categoryFilter === "ALL" ||
      ticket.category?.name === categoryFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesCategory
    );
  });

  // =========================
  // CLEAR FILTERS
  // =========================

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setCategoryFilter("ALL");
  };

  // =========================
  // PAGE TITLE
  // =========================

  const getPageTitle = () => {
    if (customerId) {
      return `Customer #${customerId} Tickets`;
    }

    if (urlStatus === "RESOLVED") {
      return "Resolved Tickets";
    }

    if (urlStatus) {
      return `${urlStatus
        .replaceAll("_", " ")
        .replace(
          /\b\w/g,
          (letter) => letter.toUpperCase()
        )} Tickets`;
    }

    if (urlPriority) {
      return `${urlPriority} Priority Tickets`;
    }

    return "Tickets";
  };

  // =========================
  // PAGE DESCRIPTION
  // =========================

  const getPageDescription = () => {
    if (customerId) {
      return "View tickets submitted by this customer.";
    }

    if (urlStatus === "RESOLVED") {
      return "Showing resolved and closed tickets.";
    }

    if (urlStatus) {
      return `Showing tickets with status ${
        urlStatus.replaceAll("_", " ")
      }.`;
    }

    if (urlPriority) {
      return `Showing ${
        urlPriority.toLowerCase()
      } priority tickets.`;
    }

    return "View and manage your support tickets.";
  };

  return (
    <DashboardLayout>

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-header">

        <h1>
          {getPageTitle()}
        </h1>

        <p>
          {getPageDescription()}
        </p>

      </div>

      {/* =========================
          ACTIVE DASHBOARD FILTER
      ========================= */}

      {(urlStatus || urlPriority) && (

        <div
          style={{
            marginBottom: "15px",
            padding: "10px 14px",
            background: "#f1f5f9",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >

          <span>

            {urlStatus === "RESOLVED" && (
              <>
                Showing{" "}
                <strong>
                  RESOLVED + CLOSED
                </strong>{" "}
                tickets
              </>
            )}

            {urlStatus &&
              urlStatus !== "RESOLVED" && (
                <>
                  Showing{" "}
                  <strong>
                    {urlStatus.replaceAll(
                      "_",
                      " "
                    )}
                  </strong>{" "}
                  tickets
                </>
              )}

            {urlPriority && (
              <>
                Showing{" "}
                <strong>
                  {urlPriority}
                </strong>{" "}
                priority tickets
              </>
            )}

          </span>

        </div>

      )}

      {/* =========================
          CREATE TICKET
      ========================= */}

      {!customerId && (

        <div className="ticket-actions">

          <Link to="/tickets/create">

            <button className="primary-button">
              Create New Ticket
            </button>

          </Link>

        </div>

      )}

      {/* =========================
          SEARCH AND FILTERS
      ========================= */}

      <div className="ticket-filters">

        {/* Search */}

        <input
          type="text"
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(
              event.target.value
            )
          }
        />

        {/* Status */}

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
        >

          <option value="ALL">
            All Statuses
          </option>

          <option value="OPEN">
            Open
          </option>

          <option value="ASSIGNED">
            Assigned
          </option>

          <option value="IN_PROGRESS">
            In Progress
          </option>

          <option value="WAITING_FOR_CUSTOMER">
            Waiting for Customer
          </option>

          <option value="RESOLVED">
            Resolved
          </option>

          <option value="CLOSED">
            Closed
          </option>

        </select>

        {/* Priority */}

        <select
          value={priorityFilter}
          onChange={(event) =>
            setPriorityFilter(
              event.target.value
            )
          }
        >

          <option value="ALL">
            All Priorities
          </option>

          <option value="LOW">
            Low
          </option>

          <option value="MEDIUM">
            Medium
          </option>

          <option value="HIGH">
            High
          </option>

          <option value="URGENT">
            Urgent
          </option>

        </select>

        {/* Category */}

        <select
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(
              event.target.value
            )
          }
        >

          <option value="ALL">
            All Categories
          </option>

          {categories
            .filter(
              (category) =>
                category.isActive
            )
            .map((category) => (

              <option
                key={
                  category.categoryId
                }
                value={category.name}
              >
                {category.name}
              </option>

            ))}

        </select>

        {/* Clear Filters */}

        <button
          type="button"
          onClick={clearFilters}
        >
          Clear Filters
        </button>

      </div>

      {/* =========================
          RESULT COUNT
      ========================= */}

      {!loading && !error && (

        <p
          style={{
            margin: "10px 0 15px",
            color: "#64748b",
            fontSize: "14px",
          }}
        >

          Showing{" "}

          <strong>
            {filteredTickets.length}
          </strong>{" "}

          ticket
          {filteredTickets.length !== 1
            ? "s"
            : ""}

        </p>

      )}

      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <p>
          Loading tickets...
        </p>
      )}

      {/* =========================
          ERROR
      ========================= */}

      {error && (

        <p
          style={{
            color: "red",
          }}
        >
          {error}
        </p>

      )}

      {/* =========================
          TICKET TABLE
      ========================= */}

      {!loading && !error && (

        <div className="ticket-table-container">

          <table className="ticket-table">

            <thead>

              <tr>

                <th>
                  Ticket ID
                </th>

                <th>
                  Subject
                </th>

                <th>
                  Category
                </th>

                <th>
                  Status
                </th>

                <th>
                  Priority
                </th>

                <th>
                  Assigned Agent
                </th>

                <th>
                  Created
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredTickets.length === 0 ? (

                <tr>

                  <td colSpan="8">
                    No tickets found.
                  </td>

                </tr>

              ) : (

                filteredTickets.map(
                  (ticket) => (

                    <tr
                      key={
                        ticket.ticketId
                      }
                    >

                      {/* Ticket ID */}

                      <td>
                        #
                        {
                          ticket.ticketId
                        }
                      </td>

                      {/* Subject */}

                      <td>
                        {ticket.subject}
                      </td>

                      {/* Category */}

                      <td>
                        {ticket.category
                          ?.name ||
                          "Not assigned"}
                      </td>

                      {/* Status */}

                      <td>

                        <span
                          className={getStatusClass(
                            ticket.status
                          )}
                        >
                          {
                            ticket.status
                          }
                        </span>

                      </td>

                      {/* Priority */}

                      <td>

                        <span
                          className={getPriorityClass(
                            ticket.priority
                          )}
                        >
                          {
                            ticket.priority
                          }
                        </span>

                      </td>

                      {/* Assigned Agent */}

                      <td>
                        {getAgentName(
                          ticket
                        )}
                      </td>

                      {/* Created */}

                      <td>

                        {ticket.createdAt
                          ? new Date(
                              ticket.createdAt
                            ).toLocaleString()
                          : "-"}

                      </td>

                      {/* View */}

                      <td>

                        <Link
                          to={`/tickets/${ticket.ticketId}`}
                        >

                          <button>
                            View
                          </button>

                        </Link>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      )}

    </DashboardLayout>
  );
}


export default Tickets;
