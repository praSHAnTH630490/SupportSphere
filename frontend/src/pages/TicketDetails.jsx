import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";

import {
  authenticatedFetch,
  downloadAttachment,
  submitFeedback,
  getFeedbackByTicket
} from "../services/api";

import { useAuth } from "../context/AuthContext";

function TicketDetails() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [attachments, setAttachments] = useState([]);

  const [messageText, setMessageText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [attachmentsLoading, setAttachmentsLoading] = useState(true);

  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPriority, setUpdatingPriority] = useState(false);

  const [deletingTicket, setDeletingTicket] = useState(false);

  const [error, setError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [sendError, setSendError] = useState("");
  const [attachmentError, setAttachmentError] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // =========================
  // FEEDBACK
  // =========================

  const [feedback, setFeedback] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] =
    useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState("");

  const isAgentOrAdmin =
    user?.role === "AGENT" ||
    user?.role === "ADMIN";

  useEffect(() => {
    loadTicket();
    loadMessages();
    loadAttachments();
    loadFeedback();
  }, [ticketId]);

  // =========================
  // LOAD TICKET
  // =========================

  const loadTicket = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await authenticatedFetch(
        `/tickets/${ticketId}`
      );

      const data = await response.json();

      setTicket(data);
      setStatus(data.status);
      setPriority(data.priority);
    } catch (error) {
      console.error(
        "Ticket details error:",
        error
      );

      setError(
        error.message ||
        "Failed to load ticket"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD MESSAGES
  // =========================

  const loadMessages = async () => {
    try {
      setMessagesLoading(true);
      setMessageError("");

      const response = await authenticatedFetch(
        `/messages/ticket/${ticketId}`
      );

      const data = await response.json();

      setMessages(data);
    } catch (error) {
      console.error(
        "Messages error:",
        error
      );

      setMessageError(
        error.message ||
        "Failed to load conversation"
      );
    } finally {
      setMessagesLoading(false);
    }
  };

  // =========================
  // LOAD ATTACHMENTS
  // =========================

  const loadAttachments = async () => {
    try {
      setAttachmentsLoading(true);
      setAttachmentError("");

      const response = await authenticatedFetch(
        `/attachments/ticket/${ticketId}`
      );

      const data = await response.json();

      setAttachments(data);
    } catch (error) {
      console.error(
        "Attachments error:",
        error
      );

      setAttachmentError(
        error.message ||
        "Failed to load attachments"
      );
    } finally {
      setAttachmentsLoading(false);
    }
  };

  // =========================
  // LOAD FEEDBACK
  // =========================

  const loadFeedback = async () => {
    try {
      setFeedbackLoading(true);
      setFeedbackError("");

      const existingFeedback =
        await getFeedbackByTicket(ticketId);

      if (existingFeedback) {
        setFeedback(existingFeedback);

        setFeedbackRating(
          existingFeedback.rating || 0
        );

        setFeedbackComment(
          existingFeedback.comment || ""
        );
      } else {
        setFeedback(null);
        setFeedbackRating(0);
        setFeedbackComment("");
      }
    } catch (error) {
      console.error(
        "Feedback loading error:",
        error
      );

      setFeedbackError(
        error.message ||
        "Failed to load feedback"
      );
    } finally {
      setFeedbackLoading(false);
    }
  };

  // =========================
  // STATUS CHANGE
  // =========================

  const handleStatusChange = async (event) => {
    const newStatus =
      event.target.value;

    try {
      setUpdatingStatus(true);
      setUpdateError("");

      const response =
        await authenticatedFetch(
          `/tickets/${ticketId}/status`,
          {
            method: "PUT",
            body: JSON.stringify({
              status: newStatus
            })
          }
        );

      const updatedTicket =
        await response.json();

      setTicket(updatedTicket);
      setStatus(updatedTicket.status);
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      setStatus(ticket.status);

      setUpdateError(
        error.message ||
        "Failed to update ticket status"
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // =========================
  // PRIORITY CHANGE
  // =========================

  const handlePriorityChange = async (event) => {
    const newPriority =
      event.target.value;

    try {
      setUpdatingPriority(true);
      setUpdateError("");

      const response =
        await authenticatedFetch(
          `/tickets/${ticketId}/priority`,
          {
            method: "PUT",
            body: JSON.stringify({
              priority: newPriority
            })
          }
        );

      const updatedTicket =
        await response.json();

      setTicket(updatedTicket);
      setPriority(updatedTicket.priority);
    } catch (error) {
      console.error(
        "Priority update error:",
        error
      );

      setPriority(ticket.priority);

      setUpdateError(
        error.message ||
        "Failed to update ticket priority"
      );
    } finally {
      setUpdatingPriority(false);
    }
  };

  // =========================
  // DELETE TICKET
  // =========================

  const handleDeleteTicket = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete Ticket #${ticketId}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingTicket(true);
      setDeleteError("");

      await authenticatedFetch(
        `/tickets/${ticketId}`,
        {
          method: "DELETE"
        }
      );

      navigate("/tickets");
    } catch (error) {
      console.error(
        "Delete ticket error:",
        error
      );

      setDeleteError(
        error.message ||
        "Failed to delete ticket"
      );
    } finally {
      setDeletingTicket(false);
    }
  };

  // =========================
  // SEND MESSAGE
  // =========================

  const handleSendMessage = async (event) => {
    event.preventDefault();

    if (!messageText.trim()) {
      return;
    }

    try {
      setSending(true);
      setSendError("");

      const response =
        await authenticatedFetch(
          "/messages",
          {
            method: "POST",
            body: JSON.stringify({
              ticket: {
                ticketId: Number(ticketId)
              },
              message: messageText.trim()
            })
          }
        );

      const data =
        await response.json();

      setMessages(
        (previousMessages) => [
          ...previousMessages,
          data
        ]
      );

      setMessageText("");
    } catch (error) {
      console.error(
        "Send message error:",
        error
      );

      setSendError(
        error.message ||
        "Failed to send message"
      );
    } finally {
      setSending(false);
    }
  };

  // =========================
  // FILE CHANGE
  // =========================

  const handleFileChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setAttachmentError("");
  };

  // =========================
  // UPLOAD ATTACHMENT
  // =========================

  const handleUploadAttachment =
    async (event) => {
      event.preventDefault();

      if (!selectedFile) {
        setAttachmentError(
          "Please select a file."
        );

        return;
      }

      try {
        setUploading(true);
        setAttachmentError("");

        const formData =
          new FormData();

        formData.append(
          "file",
          selectedFile
        );

        const response =
          await authenticatedFetch(
            `/attachments/ticket/${ticketId}`,
            {
              method: "POST",
              body: formData
            }
          );

        const data =
          await response.json();

        setAttachments(
          (previousAttachments) => [
            ...previousAttachments,
            data
          ]
        );

        setSelectedFile(null);

        const fileInput =
          document.getElementById(
            "ticket-attachment"
          );

        if (fileInput) {
          fileInput.value = "";
        }
      } catch (error) {
        console.error(
          "Attachment upload error:",
          error
        );

        setAttachmentError(
          error.message ||
          "Failed to upload attachment"
        );
      } finally {
        setUploading(false);
      }
    };

  // =========================
  // FORMAT FILE SIZE
  // =========================

  const formatFileSize = (fileSize) => {
    if (!fileSize) {
      return "0 Bytes";
    }

    if (fileSize < 1024) {
      return `${fileSize} Bytes`;
    }

    if (fileSize < 1024 * 1024) {
      return `${(
        fileSize / 1024
      ).toFixed(1)} KB`;
    }

    if (
      fileSize <
      1024 * 1024 * 1024
    ) {
      return `${(
        fileSize /
        (1024 * 1024)
      ).toFixed(1)} MB`;
    }

    return `${(
      fileSize /
      (1024 * 1024 * 1024)
    ).toFixed(1)} GB`;
  };

  // =========================
  // OPEN ATTACHMENT
  // =========================

  const handleOpenAttachment =
    async (attachment) => {
      try {
        setAttachmentError("");

        const blob =
          await downloadAttachment(
            attachment.attachmentId
          );

        const fileUrl =
          URL.createObjectURL(blob);

        window.open(
          fileUrl,
          "_blank"
        );

        setTimeout(() => {
          URL.revokeObjectURL(
            fileUrl
          );
        }, 60000);
      } catch (error) {
        console.error(
          "Open attachment error:",
          error
        );

        setAttachmentError(
          error.message ||
          "Failed to open attachment."
        );
      }
    };

  // =========================
  // SUBMIT FEEDBACK
  // =========================

  const handleSubmitFeedback =
    async (event) => {
      event.preventDefault();

      if (!feedbackRating) {
        setFeedbackError(
          "Please select a rating from 1 to 5."
        );

        return;
      }

      if (!ticket?.customer?.customerId) {
        setFeedbackError(
          "Customer information is not available."
        );

        return;
      }

      try {
        setFeedbackSubmitting(true);
        setFeedbackError("");
        setFeedbackSuccess("");

        const response =
          await submitFeedback(
            ticket.ticketId,
            ticket.customer.customerId,
            feedbackRating,
            feedbackComment
          );

        const data =
          await response.json();

        setFeedback(data);

        setFeedbackSuccess(
          "Thank you! Your feedback has been submitted."
        );
      } catch (error) {
        console.error(
          "Feedback submission error:",
          error
        );

        setFeedbackError(
          error.message ||
          "Failed to submit feedback."
        );
      } finally {
        setFeedbackSubmitting(false);
      }
    };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <DashboardLayout>

        <div className="loading-state">

          <p>
            Loading ticket...
          </p>

        </div>

      </DashboardLayout>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <DashboardLayout>

        <div className="error-card">

          <h2>
            Unable to load ticket
          </h2>

          <p>
            {error}
          </p>

          <Link to="/tickets">
            ← Back to Tickets
          </Link>

        </div>

      </DashboardLayout>
    );
  }

  // =========================
  // NOT FOUND
  // =========================

  if (!ticket) {
    return (
      <DashboardLayout>

        <div className="error-card">

          <h2>
            Ticket Not Found
          </h2>

          <p>
            The requested ticket could
            not be found.
          </p>

          <Link to="/tickets">
            ← Back to Tickets
          </Link>

        </div>

      </DashboardLayout>
    );
  }

  // =========================
  // FEEDBACK CONDITION
  // =========================

  const canGiveFeedback =
    user?.role === "CUSTOMER" &&
    (
      ticket.status === "RESOLVED" ||
      ticket.status === "CLOSED"
    );

  // =========================
  // STATUS STEPS
  // =========================

  const ticketSteps = [
    "OPEN",
    "ASSIGNED",
    "IN_PROGRESS",
    "WAITING_FOR_CUSTOMER",
    "RESOLVED",
    "CLOSED"
  ];

  const currentStatusIndex =
    ticketSteps.indexOf(ticket.status);

  // =========================
  // ASSIGNED AGENT DATA
  // =========================

  const assignedAgent =
    ticket.assignedAgent;

  const assignedAgentUser =
    assignedAgent?.user;

  return (
    <DashboardLayout>

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-header">

        <Link
          to="/tickets"
          className="back-link"
        >
          ← Back to Tickets
        </Link>

        <h1>
          Ticket #{ticket.ticketId}
        </h1>

        <p>
          View ticket details and
          conversation.
        </p>

      </div>


      {/* =========================
          TICKET DETAILS
      ========================= */}

      <div className="ticket-details-card">

        <div className="ticket-details-header">

          <div>

            <h2>
              {ticket.subject}
            </h2>

            <p>
              Created:{" "}
              {ticket.createdAt
                ? new Date(
                    ticket.createdAt
                  ).toLocaleString()
                : "-"}
            </p>

          </div>

          <div className="ticket-badges">

            <span className="ticket-status">
              {ticket.status}
            </span>

            <span className="ticket-priority">
              {ticket.priority}
            </span>

          </div>

        </div>

        <hr />


        {/* =========================
            DESCRIPTION
        ========================= */}

        <div className="ticket-description">

          <h3>
            Description
          </h3>

          <p>
            {ticket.description}
          </p>

        </div>


        {/* =========================
            TICKET INFORMATION
        ========================= */}

        <div
          style={{
            marginTop: "20px",
            paddingTop: "20px",
            borderTop:
              "1px solid #e2e8f0"
          }}
        >

          <h3>
            Ticket Information
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "15px",
              marginTop: "15px"
            }}
          >

            <div>
              <strong>
                Status
              </strong>

              <p>
                {ticket.status ||
                  "-"}
              </p>
            </div>


            <div>
              <strong>
                Priority
              </strong>

              <p>
                {ticket.priority ||
                  "-"}
              </p>
            </div>


            <div>
              <strong>
                Created
              </strong>

              <p>
                {ticket.createdAt
                  ? new Date(
                      ticket.createdAt
                    ).toLocaleString()
                  : "-"}
              </p>
            </div>


            <div>
              <strong>
                Last Updated
              </strong>

              <p>
                {ticket.updatedAt
                  ? new Date(
                      ticket.updatedAt
                    ).toLocaleString()
                  : "-"}
              </p>
            </div>


            <div>
              <strong>
                Resolved
              </strong>

              <p>
                {ticket.resolvedAt
                  ? new Date(
                      ticket.resolvedAt
                    ).toLocaleString()
                  : "Not resolved yet"}
              </p>
            </div>


            <div>
              <strong>
                Closed
              </strong>

              <p>
                {ticket.closedAt
                  ? new Date(
                      ticket.closedAt
                    ).toLocaleString()
                  : "Not closed yet"}
              </p>
            </div>


            <div>
              <strong>
                Category
              </strong>

              <p>
                {ticket.category?.name ||
                  "Not specified"}
              </p>
            </div>

          </div>


          {/* =========================
              ASSIGNED AGENT
          ========================= */}

          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              border:
                "1px solid #e2e8f0",
              borderRadius: "8px",
              background: "#f8fafc"
            }}
          >

            <h4
              style={{
                marginTop: 0,
                marginBottom: "15px"
              }}
            >
              Assigned Agent
            </h4>

            {assignedAgent ? (

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "15px"
                }}
              >

                <div>
                  <strong>
                    Name
                  </strong>

                  <p>
                    {assignedAgentUser?.name ||
                      "Not available"}
                  </p>
                </div>


                <div>
                  <strong>
                    Email
                  </strong>

                  <p>
                    {assignedAgentUser?.email ||
                      "Not available"}
                  </p>
                </div>


                <div>
                  <strong>
                    Employee Code
                  </strong>

                  <p>
                    {assignedAgent.employeeCode ||
                      "Not available"}
                  </p>
                </div>


                <div>
                  <strong>
                    Department
                  </strong>

                  <p>
                    {assignedAgent.department ||
                      "Not specified"}
                  </p>
                </div>


                <div>
                  <strong>
                    Availability
                  </strong>

                  <p>
                    {assignedAgent.availabilityStatus ||
                      "Not available"}
                  </p>
                </div>

              </div>

            ) : (

              <p
                style={{
                  marginBottom: 0
                }}
              >
                No agent has been assigned
                to this ticket yet.
              </p>

            )}

          </div>

        </div>


        {/* =========================
            TICKET PROGRESS
        ========================= */}

        <div
          style={{
            marginTop: "25px",
            paddingTop: "20px",
            borderTop:
              "1px solid #e2e8f0"
          }}
        >

          <h3>
            Ticket Progress
          </h3>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
              marginTop: "20px",
              overflowX: "auto",
              paddingBottom: "10px"
            }}
          >

            {ticketSteps.map(
              (step, index) => {

                const stepCompleted =
                  currentStatusIndex >=
                  index;

                const isCurrent =
                  step === ticket.status;

                return (
                  <div
                    key={step}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flex:
                        index ===
                        ticketSteps.length - 1
                          ? "0 0 auto"
                          : "1 1 auto"
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        flexDirection:
                          "column",
                        alignItems:
                          "center",
                        minWidth:
                          "100px"
                      }}
                    >

                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius:
                            "50%",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          backgroundColor:
                            stepCompleted
                              ? "#2563eb"
                              : "#e2e8f0",
                          color:
                            stepCompleted
                              ? "#ffffff"
                              : "#64748b",
                          fontWeight:
                            "700",
                          border:
                            isCurrent
                              ? "3px solid #93c5fd"
                              : "none",
                          boxSizing:
                            "border-box"
                        }}
                      >

                        {stepCompleted
                          ? "✓"
                          : index + 1}

                      </div>

                      <span
                        style={{
                          marginTop:
                            "8px",
                          fontSize:
                            "12px",
                          fontWeight:
                            isCurrent
                              ? "700"
                              : "500",
                          color:
                            isCurrent
                              ? "#1d4ed8"
                              : "#475569",
                          textAlign:
                            "center",
                          whiteSpace:
                            "nowrap"
                        }}
                      >

                        {step
                          .replaceAll(
                            "_",
                            " "
                          )
                          .replace(
                            /\b\w/g,
                            (letter) =>
                              letter.toUpperCase()
                          )}

                      </span>

                    </div>

                    {index <
                      ticketSteps.length -
                        1 && (

                      <div
                        style={{
                          height: "3px",
                          flex: "1",
                          minWidth:
                            "30px",
                          backgroundColor:
                            index <
                            currentStatusIndex
                              ? "#2563eb"
                              : "#e2e8f0"
                        }}
                      />

                    )}

                  </div>
                );
              }
            )}

          </div>

        </div>


        {/* =========================
            AGENT / ADMIN CONTROLS
        ========================= */}

        {isAgentOrAdmin && (

          <div className="ticket-controls">

            <h3>
              Ticket Management
            </h3>


            <div className="form-group">

              <label>
                Status
              </label>

              <select
                value={status}
                onChange={
                  handleStatusChange
                }
                disabled={
                  updatingStatus
                }
              >

                <option value="OPEN">
                  OPEN
                </option>

                <option value="ASSIGNED">
                  ASSIGNED
                </option>

                <option value="IN_PROGRESS">
                  IN_PROGRESS
                </option>

                <option value="WAITING_FOR_CUSTOMER">
                  WAITING_FOR_CUSTOMER
                </option>

                <option value="RESOLVED">
                  RESOLVED
                </option>

                <option value="CLOSED">
                  CLOSED
                </option>

              </select>

              {updatingStatus && (
                <small>
                  Updating status...
                </small>
              )}

            </div>


            <div className="form-group">

              <label>
                Priority
              </label>

              <select
                value={priority}
                onChange={
                  handlePriorityChange
                }
                disabled={
                  updatingPriority
                }
              >

                <option value="LOW">
                  LOW
                </option>

                <option value="MEDIUM">
                  MEDIUM
                </option>

                <option value="HIGH">
                  HIGH
                </option>

                <option value="URGENT">
                  URGENT
                </option>

              </select>

              {updatingPriority && (
                <small>
                  Updating priority...
                </small>
              )}

            </div>


            {user?.role === "ADMIN" && (

              <div className="form-group">

                <label>
                  Danger Zone
                </label>

                <button
                  type="button"
                  className="danger-button"
                  onClick={
                    handleDeleteTicket
                  }
                  disabled={
                    deletingTicket
                  }
                >
                  {deletingTicket
                    ? "Deleting..."
                    : "Delete Ticket"}
                </button>

              </div>

            )}


            {updateError && (
              <div className="message-error">
                {updateError}
              </div>
            )}

            {deleteError && (
              <div className="message-error">
                {deleteError}
              </div>
            )}

          </div>

        )}

      </div>


      {/* =========================
          CUSTOMER FEEDBACK
      ========================= */}

      {canGiveFeedback && (

        <div
          className="conversation-card"
          style={{
            marginTop: "20px"
          }}
        >

          <div className="conversation-header">

            <h2>
              Customer Feedback
            </h2>

          </div>


          {feedbackLoading ? (

            <div className="loading-state">

              <p>
                Loading feedback...
              </p>

            </div>

          ) : feedback ? (

            <div>

              <h3>
                Your Rating
              </h3>

              <div
                style={{
                  fontSize: "28px",
                  marginTop: "10px",
                  letterSpacing: "3px"
                }}
              >

                {[1, 2, 3, 4, 5].map(
                  (star) => (

                    <span
                      key={star}
                      style={{
                        color:
                          star <=
                          feedback.rating
                            ? "#f59e0b"
                            : "#cbd5e1"
                      }}
                    >
                      ★
                    </span>

                  )
                )}

              </div>

              <p>
                <strong>
                  Rating:
                </strong>{" "}
                {feedback.rating}/5
              </p>

              <p>
                <strong>
                  Comment:
                </strong>{" "}
                {feedback.comment ||
                  "No comment provided."}
              </p>

              <small>
                Submitted:{" "}
                {feedback.createdAt
                  ? new Date(
                      feedback.createdAt
                    ).toLocaleString()
                  : "-"}
              </small>

            </div>

          ) : (

            <form
              onSubmit={
                handleSubmitFeedback
              }
            >

              <div className="form-group">

                <label>
                  Rate your support experience
                </label>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "10px"
                  }}
                >

                  {[1, 2, 3, 4, 5].map(
                    (star) => (

                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setFeedbackRating(
                            star
                          )
                        }
                        style={{
                          border:
                            "none",
                          background:
                            "transparent",
                          cursor:
                            "pointer",
                          fontSize:
                            "32px",
                          padding:
                            "0"
                        }}
                        aria-label={`Rate ${star} out of 5`}
                      >

                        <span
                          style={{
                            color:
                              star <=
                              feedbackRating
                                ? "#f59e0b"
                                : "#cbd5e1"
                          }}
                        >
                          ★
                        </span>

                      </button>

                    )
                  )}

                </div>

                {feedbackRating > 0 && (
                  <small>
                    You selected{" "}
                    {feedbackRating}/5
                  </small>
                )}

              </div>


              <div className="form-group">

                <label
                  htmlFor="feedback-comment"
                >
                  Comment
                </label>

                <textarea
                  id="feedback-comment"
                  value={
                    feedbackComment
                  }
                  onChange={(event) =>
                    setFeedbackComment(
                      event.target.value
                    )
                  }
                  placeholder="Tell us about your support experience..."
                  rows="4"
                />

              </div>


              {feedbackError && (
                <div className="message-error">
                  {feedbackError}
                </div>
              )}

              {feedbackSuccess && (
                <div
                  style={{
                    padding: "10px",
                    marginBottom:
                      "15px",
                    borderRadius:
                      "6px",
                    background:
                      "#dcfce7",
                    color:
                      "#166534"
                  }}
                >
                  {feedbackSuccess}
                </div>
              )}


              <button
                type="submit"
                className="primary-button"
                disabled={
                  feedbackSubmitting ||
                  feedbackRating === 0
                }
              >
                {feedbackSubmitting
                  ? "Submitting..."
                  : "Submit Feedback"}
              </button>

            </form>

          )}

        </div>

      )}


      {/* =========================
          ATTACHMENTS
      ========================= */}

      <div className="conversation-card">

        <div className="conversation-header">

          <h2>
            Attachments
          </h2>

          <span className="message-count">
            {attachments.length}{" "}
            {attachments.length === 1
              ? "file"
              : "files"}
          </span>

        </div>


        <div className="reply-section">

          <h3>
            Upload Attachment
          </h3>

          <form
            onSubmit={
              handleUploadAttachment
            }
          >

            <div className="form-group">

              <label
                htmlFor="ticket-attachment"
              >
                Select File
              </label>

              <input
                id="ticket-attachment"
                type="file"
                onChange={
                  handleFileChange
                }
              />

            </div>

            {selectedFile && (
              <p>
                Selected:{" "}
                <strong>
                  {selectedFile.name}
                </strong>
              </p>
            )}

            {attachmentError && (
              <div className="message-error">
                {attachmentError}
              </div>
            )}

            <button
              type="submit"
              className="primary-button"
              disabled={
                uploading ||
                !selectedFile
              }
            >
              {uploading
                ? "Uploading..."
                : "Upload File"}
            </button>

          </form>

        </div>


        <div className="messages-list">

          {attachmentsLoading && (

            <div className="loading-state">

              <p>
                Loading attachments...
              </p>

            </div>

          )}


          {!attachmentsLoading &&
            attachments.length === 0 && (

              <div className="empty-conversation">

                <p>
                  No attachments for
                  this ticket.
                </p>

              </div>

            )}


          {!attachmentsLoading &&
            attachments.length > 0 &&
            attachments.map(
              (attachment) => (

                <div
                  className="message"
                  key={
                    attachment.attachmentId
                  }
                >

                  <div className="message-header">

                    <strong>
                      📎{" "}
                      {
                        attachment.fileName
                      }
                    </strong>

                    <small>
                      {attachment.createdAt
                        ? new Date(
                            attachment.createdAt
                          ).toLocaleString()
                        : ""}
                    </small>

                  </div>

                  <p>
                    Type:{" "}
                    {attachment.fileType ||
                      "Unknown"}
                    {" | "}
                    Size:{" "}
                    {formatFileSize(
                      attachment.fileSize
                    )}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleOpenAttachment(
                        attachment
                      )
                    }
                  >
                    View / Open File
                  </button>

                </div>

              )
            )}

        </div>

      </div>


      {/* =========================
          CONVERSATION
      ========================= */}

      <div className="conversation-card">

        <div className="conversation-header">

          <h2>
            Conversation
          </h2>

          <span className="message-count">
            {messages.length}{" "}
            {messages.length === 1
              ? "message"
              : "messages"}
          </span>

        </div>


        {messagesLoading && (

          <div className="loading-state">

            <p>
              Loading conversation...
            </p>

          </div>

        )}


        {messageError && (

          <div className="message-error">
            {messageError}
          </div>

        )}


        {!messagesLoading &&
          !messageError &&
          messages.length === 0 && (

            <div className="empty-conversation">

              <p>
                No messages in this
                ticket yet.
              </p>

            </div>

          )}


        {!messagesLoading &&
          !messageError &&
          messages.length > 0 && (

            <div className="messages-list">

              {messages.map(
                (message) => (

                  <div
                    className="message"
                    key={
                      message.messageId
                    }
                  >

                    <div className="message-header">

                      <strong>
                        {message.sender
                          ?.email ||
                          message.sender
                            ?.name ||
                          "User"}
                      </strong>

                      <small>
                        {message.createdAt
                          ? new Date(
                              message.createdAt
                            ).toLocaleString()
                          : ""}
                      </small>

                    </div>

                    <p>
                      {message.message}
                    </p>

                  </div>

                )
              )}

            </div>

          )}


        {/* Reply */}

        <div className="reply-section">

          <h3>
            Send a Message
          </h3>

          <form
            onSubmit={
              handleSendMessage
            }
          >

            <textarea
              value={messageText}
              onChange={(event) =>
                setMessageText(
                  event.target.value
                )
              }
              placeholder="Type your message..."
              rows="4"
              required
            />

            {sendError && (
              <div className="message-error">
                {sendError}
              </div>
            )}

            <button
              type="submit"
              className="primary-button"
              disabled={sending}
            >
              {sending
                ? "Sending..."
                : "Send Message"}
            </button>

          </form>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default TicketDetails;