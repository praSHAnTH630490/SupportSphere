import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import CustomerDashboard from "./pages/CustomerDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Tickets from "./pages/Tickets";
import CreateTicket from "./pages/CreateTicket";
import TicketDetails from "./pages/TicketDetails";
import Profile from "./pages/Profile";

import { useAuth } from "./context/AuthContext";

import NotFound from "./pages/NotFound";

import CustomerManagement from "./pages/CustomerManagement";

import AgentManagement from "./pages/AgentManagement";

import AIChat from "./pages/AIChat";

import KnowledgeManagement from "./pages/KnowledgeManagement";

import KnowledgeDocumentDetails from "./pages/KnowledgeDocumentDetails";

function HomeRedirect() {
  const { user, token } = useAuth();

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "CUSTOMER") {
    return (
      <Navigate
        to="/customer/dashboard"
        replace
      />
    );
  }

  if (user.role === "AGENT") {
    return (
      <Navigate
        to="/agent/dashboard"
        replace
      />
    );
  }

  if (user.role === "ADMIN") {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }

  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* Public Pages */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Customer Dashboard */}

        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["CUSTOMER"]}
            >
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Agent Dashboard */}

        <Route
          path="/agent/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["AGENT"]}
            >
              <AgentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
  path="/admin/knowledge"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <KnowledgeManagement />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/knowledge/:documentId"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <KnowledgeDocumentDetails />
    </ProtectedRoute>
  }
/>

        {/* Tickets */}

        <Route
          path="/tickets"
          element={
            <ProtectedRoute
              allowedRoles={[
                "CUSTOMER",
                "AGENT",
                "ADMIN"
              ]}
            >
              <Tickets />
            </ProtectedRoute>
          }
        />

        <Route path="/ai-chat" element={<AIChat />} />

        {/* Create Ticket */}

        <Route
          path="/tickets/create"
          element={
            <ProtectedRoute
              allowedRoles={["CUSTOMER"]}
            >
              <CreateTicket />
            </ProtectedRoute>
          }
        />

        {/* Ticket Details */}

        <Route
          path="/tickets/:ticketId"
          element={
            <ProtectedRoute
              allowedRoles={[
                "CUSTOMER",
                "AGENT",
                "ADMIN"
              ]}
            >
              <TicketDetails />
            </ProtectedRoute>
          }
        />

        {/* Profile */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute
              allowedRoles={[
                "CUSTOMER",
                "AGENT",
                "ADMIN"
              ]}
            >
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
  path="/admin/customers"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <CustomerManagement />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/agents"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AgentManagement />
    </ProtectedRoute>
  }
/>

        {/* Home */}

        <Route
          path="/"
          element={<HomeRedirect />}
        />

        {/* Unknown URLs */}

        <Route
  path="*"
  element={<NotFound />}
/>
      </Routes>

    </BrowserRouter>
  );
}

export default App;