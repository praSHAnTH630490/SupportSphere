import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import AIConversationHistory from "../components/AIConversationHistory";
import {
    createAIConversation,
    sendAIMessage,
    getAIMessagesByConversation
} from "../services/aiApi";

function AIChat() {
    const [conversationId, setConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [starting, setStarting] = useState(false);
    const [error, setError] = useState("");
    const [conversationRefresh, setConversationRefresh] =
        useState(0);
    const [failedMessage, setFailedMessage] = useState("");

    useEffect(() => {
        // Start with a blank chat.
        // Do NOT create a database conversation yet.
        setConversationId(null);
        setMessages([]);
    }, []);

    function startNewConversation() {
        setConversationId(null);
        setMessages([]);
        setInput("");
        setError("");
        setFailedMessage("");
    }

    async function loadConversation(id) {
        try {
            setLoading(true);
            setError("");
            setFailedMessage("");

            const conversationMessages =
                await getAIMessagesByConversation(id);

            setConversationId(id);
            setMessages(conversationMessages);
        } catch (err) {
            console.error(err);
            setError("Failed to load conversation.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSend() {
        if (!input.trim() || loading || starting) {
            return;
        }

        const userMessage = input.trim();

        setInput("");
        setError("");
        setFailedMessage("");

        try {
            setLoading(true);

            let activeConversationId = conversationId;

            /*
             * Create the database conversation ONLY
             * when the first message is actually sent.
             */
            if (!activeConversationId) {
                setStarting(true);

                const conversation =
                    await createAIConversation(
                        userMessage.length > 40
                            ? userMessage.substring(0, 40) + "..."
                            : userMessage
                    );

                activeConversationId =
                    conversation.conversationId;

                setConversationId(activeConversationId);

                setConversationRefresh(
                    (previous) => previous + 1
                );

                setStarting(false);
            }

            // Show user message immediately
            setMessages((previous) => [
                ...previous,
                {
                    messageId: `temp-${Date.now()}`,
                    senderType: "USER",
                    message: userMessage
                }
            ]);

            // Send message to backend
            const aiResponse =
                await sendAIMessage(
                    activeConversationId,
                    userMessage
                );

            // Show AI response
            setMessages((previous) => [
                ...previous,
                {
                    messageId: `ai-${Date.now()}`,
                    senderType: "AI",
                    message: aiResponse
                }
            ]);
        } catch (err) {
            console.error(err);

            setStarting(false);
            setFailedMessage(userMessage);

            let errorMessage =
                "Failed to get AI response. Please try again.";

            if (err.message) {
                const message = err.message.toLowerCase();

                if (
                    message.includes("401") ||
                    message.includes("unauthorized")
                ) {
                    errorMessage =
                        "Your session has expired. Please log in again.";
                } else if (
                    message.includes("403") ||
                    message.includes("forbidden")
                ) {
                    errorMessage =
                        "You are not authorized to use this AI conversation.";
                } else if (
                    message.includes("500") ||
                    message.includes("server")
                ) {
                    errorMessage =
                        "The AI service is temporarily unavailable. Please try again.";
                } else if (
                    message.includes("network") ||
                    message.includes("failed to fetch")
                ) {
                    errorMessage =
                        "Unable to connect to the server. Please check your connection.";
                } else {
                    errorMessage = err.message;
                }
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    async function handleRetry() {
        if (!failedMessage || loading || starting) {
            return;
        }

        const messageToRetry = failedMessage;

        setFailedMessage("");
        setError("");

        try {
            setLoading(true);

            const aiResponse =
                await sendAIMessage(
                    conversationId,
                    messageToRetry
                );

            setMessages((previous) => [
                ...previous,
                {
                    messageId: `ai-${Date.now()}`,
                    senderType: "AI",
                    message: aiResponse
                }
            ]);
        } catch (err) {
            console.error(err);

            let errorMessage =
                "Failed to get AI response. Please try again.";

            if (err.message) {
                const message = err.message.toLowerCase();

                if (
                    message.includes("401") ||
                    message.includes("unauthorized")
                ) {
                    errorMessage =
                        "Your session has expired. Please log in again.";
                } else if (
                    message.includes("403") ||
                    message.includes("forbidden")
                ) {
                    errorMessage =
                        "You are not authorized to use this AI conversation.";
                } else if (
                    message.includes("500") ||
                    message.includes("server")
                ) {
                    errorMessage =
                        "The AI service is temporarily unavailable. Please try again.";
                } else if (
                    message.includes("network") ||
                    message.includes("failed to fetch")
                ) {
                    errorMessage =
                        "Unable to connect to the server. Please check your connection.";
                } else {
                    errorMessage = err.message;
                }
            }

            setError(errorMessage);
            setFailedMessage(messageToRetry);
        } finally {
            setLoading(false);
        }
    }

    function handleDeleteConversation() {
        setConversationId(null);
        setMessages([]);
        setInput("");
        setError("");
        setFailedMessage("");
    }

    function handleKeyDown(event) {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();
            handleSend();
        }
    }

    return (
        <DashboardLayout>

            <div
                style={{
                    minHeight: "calc(100vh - 70px)",
                    backgroundColor: "#f6f8fc",
                    padding: "28px"
                }}
            >

                {/* ===================================== */}
                {/* PAGE HEADER */}
                {/* ===================================== */}

                <div
                    style={{
                        marginBottom: "22px"
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px"
                        }}
                    >

                        <div
                            style={{
                                width: "44px",
                                height: "44px",
                                borderRadius: "12px",
                                background:
                                    "linear-gradient(135deg, #4f46e5, #7c3aed)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#ffffff",
                                fontSize: "21px",
                                boxShadow:
                                    "0 5px 15px rgba(79,70,229,0.20)"
                            }}
                        >
                            ✦
                        </div>

                        <div>
                            <h2
                                style={{
                                    margin: 0,
                                    color: "#172033",
                                    fontSize: "25px",
                                    fontWeight: "700"
                                }}
                            >
                                AI Customer Support
                            </h2>

                            <p
                                style={{
                                    margin: "4px 0 0",
                                    color: "#718096",
                                    fontSize: "14px"
                                }}
                            >
                                Get instant AI-powered assistance for
                                your support questions.
                            </p>
                        </div>

                    </div>
                </div>


                {/* ===================================== */}
                {/* MAIN AI AREA */}
                {/* ===================================== */}

                <div
                    style={{
                        display: "flex",
                        gap: "20px",
                        width: "100%",
                        minHeight: "650px",
                        alignItems: "stretch"
                    }}
                >

                    {/* ================================= */}
                    {/* LEFT SIDEBAR */}
                    {/* ================================= */}

                    <div
                        style={{
                            width: "285px",
                            minWidth: "285px",
                            backgroundColor: "#ffffff",
                            border: "1px solid #e5e9f2",
                            borderRadius: "16px",
                            boxShadow:
                                "0 4px 18px rgba(15,23,42,0.05)",
                            padding: "18px"
                        }}
                    >

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "5px"
                            }}
                        >

                            <div>
                                <h5
                                    style={{
                                        margin: 0,
                                        color: "#1e293b",
                                        fontSize: "16px",
                                        fontWeight: "700"
                                    }}
                                >
                                    Conversations
                                </h5>

                                <p
                                    style={{
                                        margin: "4px 0 0",
                                        color: "#94a3b8",
                                        fontSize: "12px"
                                    }}
                                >
                                    Your AI chat history
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={startNewConversation}
                                style={{
                                    border: "none",
                                    background:
                                        "linear-gradient(135deg, #4f46e5, #6366f1)",
                                    color: "#ffffff",
                                    borderRadius: "9px",
                                    padding: "8px 11px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    cursor: "pointer"
                                }}
                            >
                                + New
                            </button>

                        </div>

                        <div
                            style={{
                                marginTop: "18px"
                            }}
                        >
                            <AIConversationHistory
                                activeConversationId={
                                    conversationId
                                }
                                onSelectConversation={
                                    loadConversation
                                }
                                onDeleteConversation={
                                    handleDeleteConversation
                                }
                                refreshTrigger={
                                    conversationRefresh
                                }
                            />
                        </div>

                    </div>


                    {/* ================================= */}
                    {/* CHAT PANEL */}
                    {/* ================================= */}

                    <div
                        style={{
                            flex: 1,
                            minWidth: 0,
                            backgroundColor: "#ffffff",
                            border: "1px solid #e5e9f2",
                            borderRadius: "16px",
                            boxShadow:
                                "0 4px 18px rgba(15,23,42,0.05)",
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden"
                        }}
                    >

                        {/* CHAT HEADER */}

                        <div
                            style={{
                                height: "78px",
                                minHeight: "78px",
                                borderBottom:
                                    "1px solid #edf0f5",
                                padding: "15px 22px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px"
                                }}
                            >

                                <div
                                    style={{
                                        width: "45px",
                                        height: "45px",
                                        borderRadius: "13px",
                                        background:
                                            "linear-gradient(135deg, #4f46e5, #7c3aed)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#ffffff",
                                        fontSize: "22px"
                                    }}
                                >
                                    ✦
                                </div>

                                <div>

                                    <div
                                        style={{
                                            color: "#1e293b",
                                            fontSize: "16px",
                                            fontWeight: "700"
                                        }}
                                    >
                                        AI Support Assistant
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            color: "#64748b",
                                            fontSize: "12px",
                                            marginTop: "3px"
                                        }}
                                    >

                                        <span
                                            style={{
                                                width: "7px",
                                                height: "7px",
                                                borderRadius: "50%",
                                                backgroundColor:
                                                    "#22c55e"
                                            }}
                                        ></span>

                                        Online and ready to help

                                    </div>

                                </div>

                            </div>

                            <div
                                style={{
                                    fontSize: "12px",
                                    color: "#94a3b8"
                                }}
                            >
                                AI Assistant
                            </div>

                        </div>


                        {/* MESSAGES */}

                        <div
                            style={{
                                flex: 1,
                                backgroundColor: "#fafbfe",
                                padding: "24px",
                                overflowY: "auto",
                                minHeight: "450px"
                            }}
                        >

                            {messages.length === 0 &&
                                !loading &&
                                !starting && (
                                    <div
                                        style={{
                                            height: "100%",
                                            minHeight: "400px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            textAlign: "center"
                                        }}
                                    >

                                        <div
                                            style={{
                                                maxWidth: "500px"
                                            }}
                                        >

                                            <div
                                                style={{
                                                    width: "72px",
                                                    height: "72px",
                                                    borderRadius: "20px",
                                                    margin: "0 auto 18px",
                                                    background:
                                                        "linear-gradient(135deg, #eef2ff, #f3e8ff)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "center",
                                                    fontSize: "31px",
                                                    color: "#6366f1"
                                                }}
                                            >
                                                ✦
                                            </div>

                                            <h3
                                                style={{
                                                    margin: "0 0 8px",
                                                    color: "#1e293b",
                                                    fontSize: "21px",
                                                    fontWeight: "700"
                                                }}
                                            >
                                                How can I help you?
                                            </h3>

                                            <p
                                                style={{
                                                    margin: 0,
                                                    color: "#718096",
                                                    fontSize: "14px",
                                                    lineHeight: "1.6"
                                                }}
                                            >
                                                Ask me about your
                                                account, support
                                                tickets, or any
                                                customer service
                                                question.
                                            </p>

                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "center",
                                                    flexWrap: "wrap",
                                                    gap: "8px",
                                                    marginTop: "20px"
                                                }}
                                            >

                                                <span
                                                    style={{
                                                        backgroundColor:
                                                            "#ffffff",
                                                        border:
                                                            "1px solid #e2e8f0",
                                                        borderRadius:
                                                            "20px",
                                                        padding:
                                                            "7px 12px",
                                                        color:
                                                            "#64748b",
                                                        fontSize:
                                                            "12px"
                                                    }}
                                                >
                                                    Account help
                                                </span>

                                                <span
                                                    style={{
                                                        backgroundColor:
                                                            "#ffffff",
                                                        border:
                                                            "1px solid #e2e8f0",
                                                        borderRadius:
                                                            "20px",
                                                        padding:
                                                            "7px 12px",
                                                        color:
                                                            "#64748b",
                                                        fontSize:
                                                            "12px"
                                                    }}
                                                >
                                                    Ticket support
                                                </span>

                                                <span
                                                    style={{
                                                        backgroundColor:
                                                            "#ffffff",
                                                        border:
                                                            "1px solid #e2e8f0",
                                                        borderRadius:
                                                            "20px",
                                                        padding:
                                                            "7px 12px",
                                                        color:
                                                            "#64748b",
                                                        fontSize:
                                                            "12px"
                                                    }}
                                                >
                                                    General questions
                                                </span>

                                            </div>

                                        </div>

                                    </div>
                                )}


                            {messages.map((msg) => {

                                const isUser =
                                    msg.senderType === "USER";

                                return (
                                    <div
                                        key={msg.messageId}
                                        style={{
                                            display: "flex",
                                            justifyContent:
                                                isUser
                                                    ? "flex-end"
                                                    : "flex-start",
                                            marginBottom: "18px"
                                        }}
                                    >

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "flex-end",
                                                gap: "9px",
                                                maxWidth: "75%",
                                                flexDirection:
                                                    isUser
                                                        ? "row-reverse"
                                                        : "row"
                                            }}
                                        >

                                            <div
                                                style={{
                                                    width: "32px",
                                                    height: "32px",
                                                    minWidth: "32px",
                                                    borderRadius:
                                                        "50%",
                                                    backgroundColor:
                                                        isUser
                                                            ? "#4f46e5"
                                                            : "#ede9fe",
                                                    color:
                                                        isUser
                                                            ? "#ffffff"
                                                            : "#7c3aed",
                                                    display: "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    fontSize: "13px",
                                                    fontWeight:
                                                        "700"
                                                }}
                                            >
                                                {isUser
                                                    ? "U"
                                                    : "✦"}
                                            </div>

                                            <div
                                                style={{
                                                    padding:
                                                        "11px 15px",
                                                    borderRadius:
                                                        isUser
                                                            ? "16px 16px 4px 16px"
                                                            : "16px 16px 16px 4px",
                                                    backgroundColor:
                                                        isUser
                                                            ? "#4f46e5"
                                                            : "#ffffff",
                                                    color:
                                                        isUser
                                                            ? "#ffffff"
                                                            : "#334155",
                                                    border:
                                                        isUser
                                                            ? "none"
                                                            : "1px solid #e5e9f2",
                                                    boxShadow:
                                                        "0 2px 7px rgba(15,23,42,0.05)",
                                                    fontSize:
                                                        "14px",
                                                    lineHeight:
                                                        "1.55",
                                                    whiteSpace:
                                                        "pre-wrap"
                                                }}
                                            >
                                                {msg.message}
                                            </div>

                                        </div>

                                    </div>
                                );
                            })}


                            {loading && (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "9px",
                                        marginTop: "5px"
                                    }}
                                >

                                    <div
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "50%",
                                            backgroundColor:
                                                "#ede9fe",
                                            display: "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            color: "#7c3aed"
                                        }}
                                    >
                                        ✦
                                    </div>

                                    <div
                                        style={{
                                            backgroundColor:
                                                "#ffffff",
                                            border:
                                                "1px solid #e5e9f2",
                                            borderRadius:
                                                "16px",
                                            padding:
                                                "10px 15px",
                                            color: "#94a3b8",
                                            fontSize: "13px"
                                        }}
                                    >
                                        {starting
                                            ? "Starting conversation..."
                                            : "AI is thinking..."}
                                    </div>

                                </div>
                            )}

                        </div>


                        {/* ERROR */}

                        {error && (
                            <div
                                style={{
                                    margin: "12px 18px 0",
                                    padding: "12px 14px",
                                    borderRadius: "8px",
                                    backgroundColor: "#fef2f2",
                                    border: "1px solid #fecaca",
                                    color: "#b91c1c",
                                    fontSize: "13px"
                                }}
                            >
                                <div>{error}</div>

                                {failedMessage && (
                                    <button
                                        type="button"
                                        onClick={handleRetry}
                                        disabled={
                                            loading ||
                                            starting
                                        }
                                        style={{
                                            marginTop: "8px",
                                            padding: "7px 12px",
                                            border: "none",
                                            borderRadius: "6px",
                                            backgroundColor:
                                                "#dc2626",
                                            color: "#ffffff",
                                            cursor:
                                                loading ||
                                                starting
                                                    ? "wait"
                                                    : "pointer",
                                            fontWeight: "600",
                                            fontSize: "12px"
                                        }}
                                    >
                                        {loading
                                            ? "Retrying..."
                                            : "Retry"}
                                    </button>
                                )}
                            </div>
                        )}


                        {/* INPUT */}

                        <div
                            style={{
                                padding: "14px 18px 16px",
                                backgroundColor: "#ffffff",
                                borderTop:
                                    "1px solid #edf0f5"
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                    gap: "10px",
                                    border:
                                        "1px solid #dfe4ec",
                                    borderRadius: "13px",
                                    padding: "7px",
                                    backgroundColor:
                                        "#ffffff"
                                }}
                            >

                                <textarea
                                    rows="2"
                                    value={input}
                                    placeholder="Type your message..."
                                    onChange={(e) =>
                                        setInput(
                                            e.target.value
                                        )
                                    }
                                    onKeyDown={
                                        handleKeyDown
                                    }
                                    disabled={
                                        loading ||
                                        starting
                                    }
                                    style={{
                                        flex: 1,
                                        border: "none",
                                        outline: "none",
                                        resize: "none",
                                        padding:
                                            "8px 10px",
                                        fontSize: "14px",
                                        color: "#1e293b",
                                        backgroundColor:
                                            "transparent"
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={handleSend}
                                    disabled={
                                        loading ||
                                        starting ||
                                        !input.trim()
                                    }
                                    style={{
                                        border: "none",
                                        borderRadius:
                                            "10px",
                                        background:
                                            "linear-gradient(135deg, #4f46e5, #6366f1)",
                                        color: "#ffffff",
                                        padding:
                                            "10px 18px",
                                        fontSize: "13px",
                                        fontWeight: "600",
                                        cursor:
                                            loading ||
                                            starting
                                                ? "not-allowed"
                                                : "pointer",
                                        opacity:
                                            loading ||
                                            starting ||
                                            !input.trim()
                                                ? 0.6
                                                : 1,
                                        minWidth:
                                            "70px"
                                    }}
                                >
                                    {starting
                                        ? "..."
                                        : loading
                                        ? "..."
                                        : "Send"}
                                </button>

                            </div>

                            <div
                                style={{
                                    textAlign: "center",
                                    marginTop: "7px",
                                    color: "#a0aec0",
                                    fontSize: "11px"
                                }}
                            >
                                AI responses may not always be
                                accurate. Verify important information.
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default AIChat;