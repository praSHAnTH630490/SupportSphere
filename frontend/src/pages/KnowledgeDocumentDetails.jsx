import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { authenticatedFetch } from "../services/api";

function KnowledgeDocumentDetails() {
  const { documentId } = useParams();

  const [document, setDocument] = useState(null);
  const [chunks, setChunks] = useState([]);

  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadDocument();
    loadChunks();
  }, [documentId]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await authenticatedFetch(
        `/knowledge/documents/${documentId}`
      );

      const data = await response.json();

      setDocument(data);
    } catch (error) {
      console.error(
        "Knowledge document loading error:",
        error
      );

      setError(
        error.message ||
          "Failed to load knowledge document."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadChunks = async () => {
    try {
      const response = await authenticatedFetch(
        `/knowledge/chunks/document/${documentId}`
      );

      const data = await response.json();

      setChunks(data);
    } catch (error) {
      console.error(
        "Knowledge chunks loading error:",
        error
      );
    }
  };

  const handleUpdateDocument = async (event) => {
    event.preventDefault();

    if (!document.title.trim()) {
      setError("Document title is required.");
      return;
    }

    try {
      setUpdating(true);
      setError("");
      setMessage("");

      const response = await authenticatedFetch(
        `/knowledge/documents/${documentId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            title: document.title.trim(),
            description:
              document.description?.trim() || "",
            fileUrl:
              document.fileUrl?.trim() || null,
            status: document.status,
          }),
        }
      );

      const updatedDocument =
        await response.json();

      setDocument(updatedDocument);

      setMessage(
        "Knowledge document updated successfully."
      );
    } catch (error) {
      console.error(
        "Knowledge document update error:",
        error
      );

      setError(
        error.message ||
          "Failed to update knowledge document."
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleProcessDocument = async () => {
    if (!content.trim()) {
      setError(
        "Enter knowledge content before processing."
      );
      return;
    }

    try {
      setProcessing(true);
      setError("");
      setMessage("");

      const response = await authenticatedFetch(
        `/knowledge/processing/${documentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: content,
        }
      );

      const data = await response.json();

      setChunks(data);

      setMessage(
        `Document processed successfully. ${data.length} knowledge chunk(s) created.`
      );

      await loadDocument();
    } catch (error) {
      console.error(
        "Knowledge document processing error:",
        error
      );

      setError(
        error.message ||
          "Failed to process knowledge document."
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      setError("");
      setMessage("");

      const response = await authenticatedFetch(
        `/knowledge/documents/${documentId}/status?status=${status}`,
        {
          method: "PATCH",
        }
      );

      const updatedDocument =
        await response.json();

      setDocument(updatedDocument);

      setMessage(
        `Document status changed to ${status}.`
      );
    } catch (error) {
      console.error(
        "Knowledge status update error:",
        error
      );

      setError(
        error.message ||
          "Failed to update document status."
      );
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p>
          Loading knowledge document...
        </p>
      </DashboardLayout>
    );
  }

  if (!document) {
    return (
      <DashboardLayout>
        <p style={{ color: "red" }}>
          Knowledge document not found.
        </p>

        <Link to="/admin/knowledge">
          Back to Knowledge Base
        </Link>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>
          Knowledge Document #{document.documentId}
        </h1>

        <p>
          Manage document information and knowledge
          content
        </p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <Link to="/admin/knowledge">
          ← Back to Knowledge Base
        </Link>
      </div>

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

      {/* Document Information */}

      <div
        className="form-container"
        style={{ marginBottom: "25px" }}
      >
        <h2>Document Information</h2>

        <form onSubmit={handleUpdateDocument}>
          <div className="form-group">
            <label>Title</label>

            <input
              type="text"
              value={document.title || ""}
              onChange={(event) =>
                setDocument({
                  ...document,
                  title: event.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              rows="4"
              value={
                document.description || ""
              }
              onChange={(event) =>
                setDocument({
                  ...document,
                  description:
                    event.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>File URL</label>

            <input
              type="text"
              value={document.fileUrl || ""}
              onChange={(event) =>
                setDocument({
                  ...document,
                  fileUrl: event.target.value,
                })
              }
            />
          </div>

          <button
            type="submit"
            disabled={updating}
          >
            {updating
              ? "Updating..."
              : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Document Status */}

      <div
        className="form-container"
        style={{ marginBottom: "25px" }}
      >
        <h2>Document Status</h2>

        <p>
          Current status:{" "}
          <strong>{document.status}</strong>
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() =>
              handleStatusChange("PENDING")
            }
          >
            Set Pending
          </button>

          <button
            type="button"
            onClick={() =>
              handleStatusChange("READY")
            }
          >
            Set Ready
          </button>

          <button
            type="button"
            onClick={() =>
              handleStatusChange("PROCESSING")
            }
          >
            Set Processing
          </button>
        </div>
      </div>

      {/* Knowledge Content */}

      <div
        className="form-container"
        style={{ marginBottom: "25px" }}
      >
        <h2>Knowledge Content</h2>

        <p>
          Enter the actual information that the AI
          should use when answering customer
          questions.
        </p>

        <textarea
          rows="15"
          value={content}
          onChange={(event) =>
            setContent(event.target.value)
          }
          placeholder={
            "Example:\n\nPassword Reset\n\nCustomers can reset their password by selecting 'Forgot Password' on the login page. They will receive a password reset link by email."
          }
          style={{
            width: "100%",
            resize: "vertical",
            marginBottom: "15px",
          }}
        />

        <button
          type="button"
          onClick={handleProcessDocument}
          disabled={processing}
        >
          {processing
            ? "Processing Document..."
            : "Process Knowledge Document"}
        </button>
      </div>

      {/* Generated Chunks */}

      <div className="recent-tickets">
        <h2>
          Knowledge Chunks ({chunks.length})
        </h2>

        {chunks.length === 0 ? (
          <p>
            No chunks have been created yet.
          </p>
        ) : (
          <div>
            {chunks.map((chunk) => (
              <div
                key={chunk.chunkId}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "12px",
                }}
              >
                <strong>
                  Chunk #{chunk.chunkIndex}
                </strong>

                <p
                  style={{
                    whiteSpace: "pre-wrap",
                    marginTop: "10px",
                  }}
                >
                  {chunk.chunkText}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default KnowledgeDocumentDetails;