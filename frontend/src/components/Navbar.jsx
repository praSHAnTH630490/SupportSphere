import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/api";
function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const notificationRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  const loadNotifications = async () => {
    if (!user || !token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      setNotificationLoading(true);

      const [allNotifications, unreadNotifications] =
        await Promise.all([
          getNotifications(),
          getUnreadNotifications(),
        ]);

      setNotifications(allNotifications);
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setNotificationLoading(false);
    }
  };

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setShowNotifications(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  useEffect(() => {
  loadNotifications();

  if (!user || !token) {
    return;
  }

  const notificationInterval = setInterval(() => {
    loadNotifications();
  }, 30000);

  return () => {
    clearInterval(notificationInterval);
  };
}, [user, token]);

const handleMarkAllAsRead = async () => {
  try {
    await markAllNotificationsAsRead();

    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );

    setUnreadCount(0);
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
  }
};

  const handleNotificationClick = async (notification) => {
   if (!notification.isRead) {
    try {
      await markNotificationAsRead(notification.notificationId);

      setNotifications((currentNotifications) =>
        currentNotifications.map((item) =>
          item.notificationId === notification.notificationId
            ? { ...item, isRead: true }
            : item
        )
      );

      setUnreadCount((currentCount) =>
        Math.max(currentCount - 1, 0)
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  }

  const ticketMatch =
    notification.message?.match(/ticket\s+#(\d+)/i);

  if (ticketMatch) {
    const ticketId = ticketMatch[1];

    setShowNotifications(false);

    navigate(`/tickets/${ticketId}`);
  }

  try {
    await markNotificationAsRead(notification.notificationId);

    setNotifications((currentNotifications) =>
      currentNotifications.map((item) =>
        item.notificationId === notification.notificationId
          ? { ...item, isRead: true }
          : item
      )
    );

    setUnreadCount((currentCount) =>
      Math.max(currentCount - 1, 0)
    );
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
};

  const formatNotificationTime = (dateTime) => {
    if (!dateTime) {
      return "";
    }

    const date = new Date(dateTime);

    return date.toLocaleString();
  };


  return (
    <header className="navbar">

      <div className="navbar-brand">
        <Link to={user && token ? "/" : "/login"}>
          SupportSphere
        </Link>
      </div>

      <nav className="navbar-links">

        {!user || !token ? (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>
        ) : (
          <>
            <span className="navbar-user">
              {user.name || user.email}
            </span>

            <span className="navbar-role">
              {user.role}
            </span>

            {/* Notification Bell */}
            <div
  className="notification-wrapper"
  ref={notificationRef}
>

              <button
                type="button"
                className="notification-button"
                onClick={() =>
                  setShowNotifications(!showNotifications)
                }
                title="Notifications"
              >
                🔔

                {unreadCount > 0 && (
                  <span className="notification-badge">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">

                  <div className="notification-header">
  <strong>
  Notifications
  {unreadCount > 0 && ` (${unreadCount} unread)`}
</strong>

  <div className="notification-actions">
    <button
      type="button"
      onClick={handleMarkAllAsRead}
      disabled={unreadCount === 0}
    >
      Mark all as read
    </button>

    <button
      type="button"
      onClick={loadNotifications}
    >
      Refresh
    </button>
  </div>
</div>

                  {notificationLoading ? (
                    <div className="notification-empty">
                      Loading...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="notification-empty">
                      No notifications
                    </div>
                  ) : (
                    <div className="notification-list">

                      {notifications.map((notification) => (
                        <div
  key={notification.notificationId}
  className={`notification-item ${
    notification.isRead
      ? ""
      : "notification-unread"
  }`}
  onClick={() => handleNotificationClick(notification)}
>

                          <div className="notification-title">
                            {notification.title}
                          </div>

                          <div className="notification-message">
                            {notification.message}
                          </div>

                          <div className="notification-time">
                            {formatNotificationTime(
                              notification.createdAt
                            )}
                          </div>

                        </div>
                      ))}

                    </div>
                  )}

                </div>
              )}

            </div>

            <button
              type="button"
              className="navbar-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}

      </nav>

    </header>
  );
}

export default Navbar;
