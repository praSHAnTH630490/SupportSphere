import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { authenticatedFetch } from "../services/api";

function AgentManagement() {
  const [searchParams] = useSearchParams();

  // Read status from dashboard card URL
  const urlStatus = searchParams.get("status");

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingAgentId, setUpdatingAgentId] = useState(null);

  // =========================
  // CREATE AGENT FORM
  // =========================

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [agentForm, setAgentForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    employeeCode: "",
    department: "",
    availabilityStatus: "AVAILABLE",
  });

  const [creatingAgent, setCreatingAgent] = useState(false);

  // =========================
  // LOAD AGENTS
  // =========================

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await authenticatedFetch("/agents");

      const data = await response.json();

      console.log("Agents response:", data);

      setAgents(data);
    } catch (error) {
      console.error(
        "Agents loading error:",
        error
      );

      setError(
        error.message ||
          "Failed to load agents"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CREATE AGENT
  // =========================

  const handleAgentFormChange = (event) => {
    const { name, value } = event.target;

    setAgentForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleCreateAgent = async (event) => {
    event.preventDefault();

    try {
      setCreatingAgent(true);
      setError("");
      setSuccess("");

      const response = await authenticatedFetch(
        "/agents/create",
        {
          method: "POST",
          body: JSON.stringify(agentForm),
        }
      );

      const createdAgent = await response.json();

      console.log(
        "Created agent:",
        createdAgent
      );

      setSuccess(
        `Agent ${agentForm.name} created successfully.`
      );

      setAgentForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        employeeCode: "",
        department: "",
        availabilityStatus: "AVAILABLE",
      });

      setShowCreateForm(false);

      await loadAgents();

    } catch (error) {
      console.error(
        "Agent creation error:",
        error
      );

      setError(
        error.message ||
          "Failed to create agent"
      );
    } finally {
      setCreatingAgent(false);
    }
  };

  // =========================
  // UPDATE AGENT STATUS
  // =========================

  const handleAgentStatusChange = async (
    agentId,
    status
  ) => {
    try {
      setUpdatingAgentId(agentId);
      setError("");
      setSuccess("");

      await authenticatedFetch(
        `/agents/${agentId}/status?status=${status}`,
        {
          method: "PUT",
        }
      );

      await loadAgents();

    } catch (error) {
      console.error(
        "Agent status update error:",
        error
      );

      setError(
        error.message ||
          "Failed to update agent status"
      );
    } finally {
      setUpdatingAgentId(null);
    }
  };

  // =========================
  // FILTER AGENTS
  // =========================

  const filteredAgents = agents.filter(
    (agent) => {

      // No status in URL = show all agents
      if (!urlStatus) {
        return true;
      }

      return (
        (agent.availabilityStatus ||
          "OFFLINE") === urlStatus
      );
    }
  );

  // =========================
  // PAGE TITLE
  // =========================

  const getPageTitle = () => {
    if (!urlStatus) {
      return "Agent Management";
    }

    return `${urlStatus
      .replaceAll("_", " ")
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      )} Agents`;
  };

  // =========================
  // PAGE DESCRIPTION
  // =========================

  const getPageDescription = () => {
    if (!urlStatus) {
      return "View and manage SupportSphere agents.";
    }

    return `Showing agents with ${
      urlStatus.toLowerCase()
    } status.`;
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
          SUCCESS
      ========================= */}

      {success && (
        <p
          style={{
            color: "green",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            padding: "10px 12px",
            borderRadius: "6px",
            marginBottom: "15px",
          }}
        >
          {success}
        </p>
      )}

      {/* =========================
          ERROR
      ========================= */}

      {error && (

        <p
          style={{
            color: "red",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            padding: "10px 12px",
            borderRadius: "6px",
            marginBottom: "15px",
          }}
        >
          {error}
        </p>

      )}

      {/* =========================
          CREATE AGENT BUTTON
      ========================= */}

      {!urlStatus && (
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setShowCreateForm(
                !showCreateForm
              );
              setError("");
              setSuccess("");
            }}
          >
            {showCreateForm
              ? "Cancel"
              : "Create New Agent"}
          </button>
        </div>
      )}

      {/* =========================
          CREATE AGENT FORM
      ========================= */}

      {showCreateForm && !urlStatus && (

        <div
          className="recent-tickets"
          style={{
            marginBottom: "20px",
          }}
        >

          <h2>
            Create New Agent
          </h2>

          <form
            onSubmit={handleCreateAgent}
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: "15px",
              marginTop: "15px",
            }}
          >

            {/* Name */}

            <div>
              <label>
                Name
              </label>

              <input
                type="text"
                name="name"
                value={agentForm.name}
                onChange={
                  handleAgentFormChange
                }
                placeholder="Enter agent name"
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "6px",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius: "6px",
                  boxSizing:
                    "border-box",
                }}
              />
            </div>

            {/* Email */}

            <div>
              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                value={agentForm.email}
                onChange={
                  handleAgentFormChange
                }
                placeholder="Enter agent email"
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "6px",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius: "6px",
                  boxSizing:
                    "border-box",
                }}
              />
            </div>

            {/* Password */}

            <div>
              <label>
                Password
              </label>

              <input
                type="password"
                name="password"
                value={agentForm.password}
                onChange={
                  handleAgentFormChange
                }
                placeholder="Enter temporary password"
                required
                minLength={6}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "6px",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius: "6px",
                  boxSizing:
                    "border-box",
                }}
              />
            </div>

            {/* Phone */}

            <div>
              <label>
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={agentForm.phone}
                onChange={
                  handleAgentFormChange
                }
                placeholder="Enter phone number"
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "6px",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius: "6px",
                  boxSizing:
                    "border-box",
                }}
              />
            </div>

            {/* Employee Code */}

            <div>
              <label>
                Employee Code
              </label>

              <input
                type="text"
                name="employeeCode"
                value={
                  agentForm.employeeCode
                }
                onChange={
                  handleAgentFormChange
                }
                placeholder="Example: AGT003"
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "6px",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius: "6px",
                  boxSizing:
                    "border-box",
                }}
              />
            </div>

            {/* Department */}

            <div>
              <label>
                Department
              </label>

              <input
                type="text"
                name="department"
                value={
                  agentForm.department
                }
                onChange={
                  handleAgentFormChange
                }
                placeholder="Example: Technical Support"
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "6px",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius: "6px",
                  boxSizing:
                    "border-box",
                }}
              />
            </div>

            {/* Availability */}

            <div>
              <label>
                Availability Status
              </label>

              <select
                name="availabilityStatus"
                value={
                  agentForm.availabilityStatus
                }
                onChange={
                  handleAgentFormChange
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "6px",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius: "6px",
                  boxSizing:
                    "border-box",
                  background: "white",
                }}
              >
                <option value="AVAILABLE">
                  AVAILABLE
                </option>

                <option value="BUSY">
                  BUSY
                </option>

                <option value="OFFLINE">
                  OFFLINE
                </option>
              </select>
            </div>

            {/* Submit */}

            <div
              style={{
                display: "flex",
                alignItems: "end",
              }}
            >
              <button
                type="submit"
                disabled={creatingAgent}
                style={{
                  padding: "10px 18px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: creatingAgent
                    ? "not-allowed"
                    : "pointer",
                  fontWeight: "600",
                }}
              >
                {creatingAgent
                  ? "Creating..."
                  : "Create Agent"}
              </button>
            </div>

          </form>

        </div>

      )}

      {/* =========================
          AGENT SECTION
      ========================= */}

      <div className="recent-tickets">

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >

          <div>

            <h2>
              {urlStatus
                ? `${urlStatus} Agents`
                : "Agents"}
            </h2>

            {!loading && (
              <p
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  marginTop: "5px",
                }}
              >
                Showing{" "}
                <strong>
                  {filteredAgents.length}
                </strong>{" "}
                agent
                {filteredAgents.length !==
                1
                  ? "s"
                  : ""}
              </p>
            )}

          </div>

          <button
            type="button"
            onClick={loadAgents}
            disabled={loading}
          >
            {loading
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </div>

        {/* =========================
            LOADING
        ========================= */}

        {loading && (
          <p>
            Loading agents...
          </p>
        )}

        {/* =========================
            NO AGENTS
        ========================= */}

        {!loading &&
          filteredAgents.length === 0 && (

            <p>

              {urlStatus
                ? `No ${urlStatus.toLowerCase()} agents found.`
                : "No agents found."}

            </p>

          )}

        {/* =========================
            AGENT LIST
        ========================= */}

        {!loading &&
          filteredAgents.length > 0 && (

            <div className="agent-management-list">

              {filteredAgents.map(
                (agent) => (

                  <div
                    className="agent-management-card"
                    key={agent.agentId}
                  >

                    {/* Agent Information */}

                    <div>

                      <strong>
                        {agent.user?.name ||
                          "Agent"}
                      </strong>

                      <p>
                        Email:{" "}
                        {agent.user?.email ||
                          "Not available"}
                      </p>

                      <p>
                        Employee Code:{" "}
                        {agent.employeeCode ||
                          "Not specified"}
                      </p>

                      <p>
                        Department:{" "}
                        {agent.department ||
                          "Not specified"}
                      </p>

                      <p>
                        Current Status:{" "}

                        <strong>
                          {agent.availabilityStatus ||
                            "OFFLINE"}
                        </strong>

                      </p>

                    </div>

                    {/* Status Management */}

                    <div className="agent-management-actions">

                      <label>

                        Status:

                        <select
                          value={
                            agent.availabilityStatus ||
                            "OFFLINE"
                          }
                          disabled={
                            updatingAgentId ===
                            agent.agentId
                          }
                          onChange={(
                            event
                          ) =>
                            handleAgentStatusChange(
                              agent.agentId,
                              event.target.value
                            )
                          }
                        >

                          <option value="AVAILABLE">
                            AVAILABLE
                          </option>

                          <option value="BUSY">
                            BUSY
                          </option>

                          <option value="OFFLINE">
                            OFFLINE
                          </option>

                        </select>

                      </label>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

      </div>

    </DashboardLayout>
  );
}

export default AgentManagement;