import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { authenticatedFetch } from "../services/api";

function KnowledgeManagement() {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // =========================
  // LOAD DOCUMENTS
  // =========================

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await authenticatedFetch(
        "/knowledge/documents"
      );

      const data = await response.json();

      setDocuments(data);
    } catch (error) {
      console.error(
        "Knowledge documents loading error:",
        error
      );

      setError(
        error.message ||
          "Failed to load knowledge documents."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CREATE DOCUMENT
  // =========================

  const handleCreateDocument = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Document title is required.");
      return;
    }

    try {
      setCreating(true);
      setError("");
      setMessage("");

      const response = await authenticatedFetch(
        "/knowledge/documents",
        {
          method: "POST",
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            fileUrl: fileUrl.trim() || null,
          }),
        }
      );

      const createdDocument = await response.json();

      setDocuments((previousDocuments) => [
        createdDocument,
        ...previousDocuments,
      ]);

      setTitle("");
      setDescription("");
      setFileUrl("");

      setShowCreateForm(false);

      setMessage(
        "Knowledge document created successfully."
      );
    } catch (error) {
      console.error(
        "Knowledge document creation error:",
        error
      );

      setError(
        error.message ||
          "Failed to create knowledge document."
      );
    } finally {
      setCreating(false);
    }
  };

  // =========================
  // DELETE DOCUMENT
  // =========================

  const handleDeleteDocument = async (documentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this knowledge document?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(documentId);
      setError("");
      setMessage("");

      await authenticatedFetch(
        `/knowledge/documents/${documentId}`,
        {
          method: "DELETE",
        }
      );

      setDocuments((previousDocuments) =>
        previousDocuments.filter(
          (document) =>
            document.documentId !== documentId
        )
      );

      setMessage(
        "Knowledge document deleted successfully."
      );
    } catch (error) {
      console.error(
        "Knowledge document deletion error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete knowledge document."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // STATUS CLASS
  // =========================

  const getStatusClass = (status) => {
    switch (status) {
      case "READY":
        return "status-badge status-resolved";

      case "PROCESSING":
        return "status-badge status-progress";

      case "PENDING":
        return "status-badge status-waiting";

      default:
        return "status-badge";
    }
  };

  return (
    <DashboardLayout>

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-header">

        <h1>Knowledge Base</h1>

        <p>
          Manage SupportSphere knowledge documents
        </p>

      </div>

      {/* =========================
          ACTIONS
      ========================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >

        <button
          type="button"
          onClick={() =>
            setShowCreateForm(
              (previous) => !previous
            )
          }
        >
          {showCreateForm
            ? "Cancel"
            : "Add Knowledge Document"}
        </button>

        <button
          type="button"
          onClick={loadDocuments}
          disabled={loading}
        >
          {loading
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>

      {/* =========================
          SUCCESS MESSAGE
      ========================= */}

      {message && (
        <p
          style={{
            color: "green",
            marginBottom: "15px",
          }}
        >
          {message}
        </p>
      )}

      {/* =========================
          ERROR MESSAGE
      ========================= */}

      {error && (
        <p
          style={{
            color: "red",
            marginBottom: "15px",
          }}
        >
          {error}
        </p>
      )}

      {/* =========================
          CREATE FORM
      ========================= */}

      {showCreateForm && (

        <div
          className="form-container"
          style={{
            marginBottom: "25px",
          }}
        >

          <h2>
            Add Knowledge Document
          </h2>

          <form
            onSubmit={handleCreateDocument}
          >

            <div className="form-group">

              <label>
                Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Example: SupportSphere FAQ"
                required
              />

            </div>

            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Describe this knowledge document"
                rows="4"
              />

            </div>

            <div className="form-group">

              <label>
                File URL
              </label>

              <input
                type="text"
                value={fileUrl}
                onChange={(event) =>
                  setFileUrl(event.target.value)
                }
                placeholder="Optional file URL"
              />

            </div>

            <button
              type="submit"
              disabled={creating}
            >
              {creating
                ? "Creating..."
                : "Create Document"}
            </button>

          </form>

        </div>
      )}

      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <p>
          Loading knowledge documents...
        </p>
      )}

      {/* =========================
          DOCUMENT LIST
      ========================= */}

      {!loading && !error && (

        <div className="recent-tickets">

          <h2>
            Knowledge Documents
          </h2>

          {documents.length === 0 ? (

            <p>
              No knowledge documents found.
            </p>

          ) : (

            <table className="ticket-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {documents.map(
                  (document) => (

                    <tr
                      key={
                        document.documentId
                      }
                    >

                      <td>
                        #
                        {
                          document.documentId
                        }
                      </td>

                      <td>
                        {document.title}
                      </td>

                      <td>
                        {document.description ||
                          "No description"}
                      </td>

                      <td>

                        <span
                          className={getStatusClass(
                            document.status
                          )}
                        >
                          {document.status}
                        </span>

                      </td>

                      <td>
                        {document.createdAt
                          ? new Date(
                              document.createdAt
                            ).toLocaleString()
                          : "-"}
                      </td>

                      <td>

                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                          }}
                        >

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin/knowledge/${document.documentId}`
                              )
                            }
                          >
                            Manage
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteDocument(
                                document.documentId
                              )
                            }
                            disabled={
                              deletingId ===
                              document.documentId
                            }
                          >
                            {deletingId ===
                            document.documentId
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          )}

        </div>
      )}

    </DashboardLayout>
  );
}

export default KnowledgeManagement;