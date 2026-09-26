import { authenticatedFetch } from "./api";

export async function createAIConversation(title) {
    const response = await authenticatedFetch(
        "/ai/conversations",
        {
            method: "POST",
            body: JSON.stringify({
                title: title
            })
        }
    );

    return response.json();
}

export async function sendAIMessage(
    conversationId,
    message
) {
    const response = await authenticatedFetch(
        `/ai/chat/${conversationId}`,
        {
            method: "POST",
            body: JSON.stringify({
                message: message
            })
        }
    );

    return response.text();
}

export async function getAIConversations() {
    const response = await authenticatedFetch(
        "/ai/conversations"
    );

    return response.json();
}

export async function getAIMessages() {
    const response = await authenticatedFetch(
        "/ai/messages"
    );

    return response.json();
}

export async function getAIMessagesByConversation(
    conversationId
) {
    const response = await authenticatedFetch(
        `/ai/messages/conversation/${conversationId}`
    );

    return response.json();
}
export async function deleteAIConversation(
    conversationId
) {
    await authenticatedFetch(
        `/ai/conversations/${conversationId}`,
        {
            method: "DELETE"
        }
    );
}