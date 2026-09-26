import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NotFound() {
  const { user } = useAuth();

  const getHomePath = () => {
    if (!user) {
      return "/login";
    }

    if (user.role === "CUSTOMER") {
      return "/customer/dashboard";
    }

    if (user.role === "AGENT") {
      return "/agent/dashboard";
    }

    if (user.role === "ADMIN") {
      return "/admin/dashboard";
    }

    return "/login";
  };

  return (
    <div className="not-found-page">
      <div className="not-found-card">

        <div className="not-found-code">
          404
        </div>

        <h1>Page Not Found</h1>

        <p>
          The page you are looking for does not exist
          or may have been moved.
        </p>

        <Link
          to={getHomePath()}
          className="primary-button"
        >
          Go Back
        </Link>

      </div>
    </div>
  );
}

export default NotFound;