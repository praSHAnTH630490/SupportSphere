import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { authenticatedFetch } from "../services/api";

function CustomerDashboard() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      console.error("Dashboard tickets error:", error);

      setError(
        error.message || "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // TICKET STATISTICS
  // =========================

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "OPEN"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "IN_PROGRESS"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) =>
      ticket.status === "RESOLVED" ||
      ticket.status === "CLOSED"
  ).length;

  // =========================
  // DASHBOARD CARD NAVIGATION
  // =========================

  const openTicketsPage = (status = null) => {
    const params = new URLSearchParams();

    if (status) {
      params.set("status", status);
    }

    const queryString = params.toString();

    navigate(
      queryString
        ? `/tickets?${queryString}`
        : "/tickets"
    );
  };

  return (
    <DashboardLayout>

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-header">
        <h1>Customer Dashboard</h1>
        <p>Welcome to SupportSphere</p>
      </div>

      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <p>Loading dashboard...</p>
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
              DASHBOARD STATISTICS
          ========================= */}

          <div className="dashboard-cards">

            <button
              type="button"
              className="dashboard-card dashboard-card-link"
              onClick={() => openTicketsPage()}
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
              <h3>Open Tickets</h3>
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
                openTicketsPage("RESOLVED")
              }
            >
              <h3>Resolved</h3>
              <p>{resolvedTickets}</p>
            </button>

          </div>

          {/* =========================
              QUICK ACTIONS
          ========================= */}

          <div className="dashboard-actions">

            <h2>Quick Actions</h2>

            <button
              type="button"
              onClick={() => navigate("/tickets")}
            >
              View My Tickets
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/tickets/create")
              }
            >
              Create New Ticket
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/profile")
              }
            >
              My Profile
            </button>

          </div>

          {/* =========================
              RECENT TICKETS
          ========================= */}

          <div className="recent-tickets">

            <h2>Recent Tickets</h2>

            {tickets.length === 0 ? (

              <p>No tickets found.</p>

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

                  {tickets
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
                            className={`status-badge ${
                              ticket.status === "OPEN"
                                ? "status-open"
                                : ticket.status === "ASSIGNED"
                                ? "status-assigned"
                                : ticket.status ===
                                  "IN_PROGRESS"
                                ? "status-progress"
                                : ticket.status ===
                                  "WAITING_FOR_CUSTOMER"
                                ? "status-waiting"
                                : ticket.status ===
                                  "RESOLVED"
                                ? "status-resolved"
                                : ticket.status ===
                                  "CLOSED"
                                ? "status-closed"
                                : ""
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`priority-badge ${
                              ticket.priority === "LOW"
                                ? "priority-low"
                                : ticket.priority ===
                                  "MEDIUM"
                                ? "priority-medium"
                                : ticket.priority ===
                                  "HIGH"
                                ? "priority-high"
                                : ticket.priority ===
                                  "URGENT"
                                ? "priority-urgent"
                                : ""
                            }`}
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

export default CustomerDashboard;