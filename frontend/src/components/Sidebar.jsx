import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getNavClass = ({ isActive }) =>
    isActive ? "sidebar-link active" : "sidebar-link";

  return (
    <aside className="sidebar">

      <div className="sidebar-title">
        SupportSphere
      </div>

      <nav className="sidebar-nav">

        {/* Customer Navigation */}
        {user?.role === "CUSTOMER" && (
          <>
            <NavLink
              to="/customer/dashboard"
              className={getNavClass}
            >
              Customer Dashboard
            </NavLink>

            <NavLink
              to="/tickets"
              className={getNavClass}
            >
              My Tickets
            </NavLink>

            <NavLink
              to="/tickets/create"
              className={getNavClass}
            >
              Create Ticket
            </NavLink>

            <NavLink
              to="/ai-chat"
              className={getNavClass}
            >
              AI Customer Support
            </NavLink>

            <NavLink
              to="/profile"
              className={getNavClass}
            >
              My Profile
            </NavLink>
          </>
        )}

        {/* Agent Navigation */}
        {user?.role === "AGENT" && (
          <>
            <NavLink
              to="/agent/dashboard"
              className={getNavClass}
            >
              Agent Dashboard
            </NavLink>

            <NavLink
              to="/tickets"
              className={getNavClass}
            >
              Tickets
            </NavLink>

            <NavLink
              to="/ai-chat"
              className={getNavClass}
            >
              AI Customer Support
            </NavLink>

            <NavLink
              to="/profile"
              className={getNavClass}
            >
              My Profile
            </NavLink>
          </>
        )}

        {/* Admin Navigation */}
        {user?.role === "ADMIN" && (
          <>
            <NavLink
              to="/admin/dashboard"
              className={getNavClass}
            >
              Admin Dashboard
            </NavLink>

            <NavLink
              to="/tickets"
              className={getNavClass}
            >
              Tickets
            </NavLink>

            <NavLink
              to="/admin/customers"
              className={getNavClass}
            >
              Customer Management
            </NavLink>

            <NavLink
              to="/admin/agents"
              className={getNavClass}
            >
              Agent Management
            </NavLink>

            <NavLink
              to="/ai-chat"
              className={getNavClass}
            >
              AI Customer Support
            </NavLink>

            <NavLink
              to="/profile"
              className={getNavClass}
            >
              My Profile
            </NavLink>
          </>
        )}

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </button>

      </nav>
    </aside>
  );
}

export default Sidebar;