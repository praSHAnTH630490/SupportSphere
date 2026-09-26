import { useEffect, useState } from "react";
import {
    getAIConversations,
    deleteAIConversation
} from "../services/aiApi";

function AIConversationHistory({
    activeConversationId,
    onSelectConversation,
    onDeleteConversation,
    refreshTrigger
}) {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
    loadConversations();
}, [refreshTrigger]);

    async function loadConversations() {
        try {
            setLoading(true);
            setError("");

            const data = await getAIConversations();

            setConversations(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load conversations.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(
        event,
        conversationId
    ) {
        event.stopPropagation();

        const confirmed = window.confirm(
            "Are you sure you want to delete this conversation?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(conversationId);
            setError("");

            await deleteAIConversation(
                conversationId
            );

            setConversations((current) =>
                current.filter(
                    (conversation) =>
                        conversation.conversationId !==
                        conversationId
                )
            );

            if (
                activeConversationId ===
                conversationId
            ) {
                onDeleteConversation(
                    conversationId
                );
            }
        } catch (err) {
            console.error(err);
            setError(
                "Failed to delete conversation."
            );
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div
            style={{
                width: "100%"
            }}
        >
            {/* Dropdown Header */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                style={{
                    width: "100%",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    padding: "13px 15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    color: "#334155",
                    fontWeight: "600",
                    fontSize: "14px"
                }}
            >
                <span>
                    💬 Conversation History
                </span>

                <span
                    style={{
                        fontSize: "14px",
                        transition:
                            "transform 0.2s ease",
                        transform: open
                            ? "rotate(180deg)"
                            : "rotate(0deg)"
                    }}
                >
                    ▼
                </span>
            </button>

            {/* Dropdown Content */}
            {open && (
                <div
                    style={{
                        marginTop: "8px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        backgroundColor: "#ffffff",
                        maxHeight: "300px",
                        overflowY: "auto",
                        padding: "6px"
                    }}
                >
                    {loading && (
                        <div
                            style={{
                                padding: "18px",
                                textAlign: "center",
                                color: "#64748b",
                                fontSize: "13px"
                            }}
                        >
                            Loading conversations...
                        </div>
                    )}

                    {error && (
                        <div
                            style={{
                                padding: "15px",
                                color: "#dc2626",
                                fontSize: "13px"
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        conversations.length === 0 && (
                            <div
                                style={{
                                    padding: "20px",
                                    textAlign: "center",
                                    color: "#94a3b8",
                                    fontSize: "13px"
                                }}
                            >
                                No previous conversations.
                            </div>
                        )}

                    {!loading &&
                        conversations.map(
                            (conversation) => {
                                const isActive =
                                    activeConversationId ===
                                    conversation.conversationId;

                                const isDeleting =
                                    deletingId ===
                                    conversation.conversationId;

                                return (
                                    <div
                                        key={
                                            conversation.conversationId
                                        }
                                        style={{
                                            display: "flex",
                                            alignItems:
                                                "center",
                                            gap: "4px",
                                            marginBottom:
                                                "3px"
                                        }}
                                    >
                                        {/* Conversation */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onSelectConversation(
                                                    conversation.conversationId
                                                );
                                                setOpen(
                                                    false
                                                );
                                            }}
                                            style={{
                                                flex: 1,
                                                minWidth: 0,
                                                display:
                                                    "block",
                                                border: "none",
                                                borderRadius:
                                                    "8px",
                                                backgroundColor:
                                                    isActive
                                                        ? "#eff6ff"
                                                        : "#ffffff",
                                                padding:
                                                    "10px 12px",
                                                textAlign:
                                                    "left",
                                                cursor:
                                                    "pointer"
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center"
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width:
                                                            "30px",
                                                        height:
                                                            "30px",
                                                        minWidth:
                                                            "30px",
                                                        borderRadius:
                                                            "8px",
                                                        backgroundColor:
                                                            isActive
                                                                ? "#dbeafe"
                                                                : "#f1f5f9",
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "center",
                                                        marginRight:
                                                            "10px"
                                                    }}
                                                >
                                                    💬
                                                </div>

                                                <div
                                                    style={{
                                                        minWidth:
                                                            0
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            fontSize:
                                                                "13px",
                                                            fontWeight:
                                                                "600",
                                                            color:
                                                                isActive
                                                                    ? "#2563eb"
                                                                    : "#334155",
                                                            whiteSpace:
                                                                "nowrap",
                                                            overflow:
                                                                "hidden",
                                                            textOverflow:
                                                                "ellipsis"
                                                        }}
                                                    >
                                                        {conversation.title ||
                                                            "AI Conversation"}
                                                    </div>

                                                    <div
                                                        style={{
                                                            fontSize:
                                                                "11px",
                                                            color:
                                                                "#94a3b8",
                                                            marginTop:
                                                                "2px"
                                                        }}
                                                    >
                                                        {conversation.createdAt
                                                            ? new Date(
                                                                  conversation.createdAt
                                                              ).toLocaleString()
                                                            : ""}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            type="button"
                                            disabled={
                                                isDeleting
                                            }
                                            onClick={(
                                                event
                                            ) =>
                                                handleDelete(
                                                    event,
                                                    conversation.conversationId
                                                )
                                            }
                                            title="Delete conversation"
                                            style={{
                                                width:
                                                    "34px",
                                                height:
                                                    "34px",
                                                minWidth:
                                                    "34px",
                                                border:
                                                    "none",
                                                borderRadius:
                                                    "8px",
                                                backgroundColor:
                                                    "#fef2f2",
                                                color:
                                                    "#dc2626",
                                                cursor:
                                                    isDeleting
                                                        ? "wait"
                                                        : "pointer",
                                                fontSize:
                                                    "15px",
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center"
                                            }}
                                        >
                                            {isDeleting
                                                ? "..."
                                                : "🗑️"}
                                        </button>
                                    </div>
                                );
                            }
                        )}
                </div>
            )}
        </div>
    );
}

export default AIConversationHistory;