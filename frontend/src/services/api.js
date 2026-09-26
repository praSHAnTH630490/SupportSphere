const API_BASE_URL = "http://localhost:8081/api";

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Login failed"
    );
  }

  return data;
}

export async function registerUser(
  name,
  email,
  password,
  phone
) {
  const response = await fetch(
    `${API_BASE_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password,
        phone
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : data.message || "Registration failed"
    );
  }

  return data;
}

export async function authenticatedFetch(endpoint, options = {}) {
  const token = localStorage.getItem("supportSphereToken");

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("supportSphereToken");
    localStorage.removeItem("supportSphereUser");

    throw new Error(
      "Your session has expired. Please login again."
    );
  }

  if (!response.ok) {
    let errorMessage = "Request failed";

    try {
      const errorData = await response.json();

      errorMessage =
        errorData.message ||
        errorData.error ||
        errorData ||
        errorMessage;
    } catch {
      // Response did not contain JSON
    }

    throw new Error(errorMessage);
  }

  return response;
}
export async function downloadAttachment(attachmentId) {
  const token = localStorage.getItem("supportSphereToken");

  const response = await fetch(
    `${API_BASE_URL}/attachments/${attachmentId}/download`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status === 401) {
    localStorage.removeItem("supportSphereToken");
    localStorage.removeItem("supportSphereUser");

    throw new Error(
      "Your session has expired. Please login again."
    );
  }

  if (!response.ok) {
    let errorMessage = "Failed to open attachment.";

    try {
      const errorData = await response.json();

      errorMessage =
        errorData.message ||
        errorData.error ||
        errorData ||
        errorMessage;
    } catch {
      // Response was not JSON
    }

    throw new Error(errorMessage);
  }

  return response.blob();
}
export async function getNotifications() {
  const response = await authenticatedFetch("/notifications");
  return response.json();
}

export async function getUnreadNotifications() {
  const response = await authenticatedFetch("/notifications/unread");
  return response.json();
}
export async function markNotificationAsRead(notificationId) {
  const response = await authenticatedFetch(
    `/notifications/${notificationId}/read`,
    {
      method: "PUT",
    }
  );

  return response.json();
}
export async function markAllNotificationsAsRead() {
  await authenticatedFetch("/notifications/read-all", {
    method: "PUT",
  });
}
export async function submitFeedback(ticketId, customerId, rating, comment) {
  const params = new URLSearchParams({
    ticketId: String(ticketId),
    customerId: String(customerId),
    rating: String(rating),
  });

  if (comment && comment.trim()) {
    params.append("comment", comment.trim());
  }

  return authenticatedFetch(`/feedback?${params.toString()}`, {
    method: "POST",
  });
}

export async function getFeedbackByTicket(ticketId) {
  const response = await authenticatedFetch("/feedback");
  const feedbackList = await response.json();

  return feedbackList.find(
    (feedback) =>
      feedback.ticket &&
      Number(feedback.ticket.ticketId) === Number(ticketId)
  );
}
export async function getAIMessagesByConversation(
    conversationId
) {
    const response = await authenticatedFetch(
        `/ai/messages/conversation/${conversationId}`
    );

    return response.json();
}