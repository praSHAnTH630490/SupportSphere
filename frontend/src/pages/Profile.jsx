import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { authenticatedFetch } from "../services/api";

function Profile() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    address: "",
    employeeCode: "",
    department: "",
    availabilityStatus: "",
  });

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  // =========================
  // LOAD PROFILE
  // =========================

  const loadProfile = async () => {
    try {
      setError("");

      if (user.role === "CUSTOMER") {
        // =========================
        // CUSTOMER PROFILE
        // =========================

        const response = await authenticatedFetch(
          "/customers/profile"
        );

        const customerData = await response.json();

        const customerUser = customerData.user;

        setFormData({
          name: customerUser?.name || "",
          email: customerUser?.email || "",
          phone: customerUser?.phone || "",
          companyName: customerData.companyName || "",
          address: customerData.address || "",
          employeeCode: "",
          department: "",
          availabilityStatus: "",
        });

      } else if (user.role === "AGENT") {
        // =========================
        // AGENT PROFILE
        // =========================

        const userResponse = await authenticatedFetch(
          `/users/${user.userId}`
        );

        const userData = await userResponse.json();

        const agentResponse = await authenticatedFetch(
          `/agents/user/${user.userId}`
        );

        const agentData = await agentResponse.json();

        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          companyName: "",
          address: "",
          employeeCode: agentData.employeeCode || "",
          department: agentData.department || "",
          availabilityStatus:
            agentData.availabilityStatus || "OFFLINE",
        });

      } else {
        // =========================
        // ADMIN PROFILE
        // =========================

        const response = await authenticatedFetch(
          `/users/${user.userId}`
        );

        const userData = await response.json();

        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          companyName: "",
          address: "",
          employeeCode: "",
          department: "",
          availabilityStatus: "",
        });
      }

    } catch (error) {
      console.error("Profile loading error:", error);

      setError(
        error.message || "Failed to load profile."
      );
    }
  };

  // =========================
  // LOADING USER
  // =========================

  if (!user) {
    return (
      <DashboardLayout>
        <p>Loading profile...</p>
      </DashboardLayout>
    );
  }

  // =========================
  // PROFILE HEADER
  // =========================

  const displayName = formData.name || "User";

  const initial = displayName
    .charAt(0)
    .toUpperCase();

  // =========================
  // ROLE LABEL
  // =========================

  const getRoleLabel = () => {
    switch (user.role) {
      case "CUSTOMER":
        return "Customer";

      case "AGENT":
        return "Support Agent";

      case "ADMIN":
        return "Administrator";

      default:
        return user.role || "User";
    }
  };

  // =========================
  // AGENT STATUS LABEL
  // =========================

  const getAgentStatusLabel = () => {
    switch (formData.availabilityStatus) {
      case "AVAILABLE":
        return "Available";

      case "BUSY":
        return "Busy";

      case "OFFLINE":
        return "Offline";

      default:
        return "Not specified";
    }
  };

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = () => {
    setEditing(true);
    setMessage("");
    setError("");
  };

  // =========================
  // CANCEL
  // =========================

  const handleCancel = () => {
    setEditing(false);
    setMessage("");
    setError("");

    loadProfile();
  };

  // =========================
  // SAVE PROFILE
  // =========================

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      if (user.role === "CUSTOMER") {

        // =========================
        // CUSTOMER UPDATE
        // =========================

        const response = await authenticatedFetch(
          "/customers/profile",
          {
            method: "PUT",
            body: JSON.stringify({
              user: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
              },
              companyName: formData.companyName,
              address: formData.address,
            }),
          }
        );

        const updatedCustomer =
          await response.json();

        const updatedUser =
          updatedCustomer.user;

        if (updatedUser) {
          localStorage.setItem(
            "supportSphereUser",
            JSON.stringify({
              ...user,
              name: updatedUser.name,
              email: updatedUser.email,
              phone: updatedUser.phone,
            })
          );
        }

      } else {

        // =========================
        // ADMIN / AGENT USER UPDATE
        // =========================

        const response = await authenticatedFetch(
          `/users/${user.userId}`,
          {
            method: "PUT",
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
            }),
          }
        );

        const updatedUser =
          await response.json();

        localStorage.setItem(
          "supportSphereUser",
          JSON.stringify({
            ...user,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
          })
        );
      }

      setEditing(false);

      setMessage(
        "Profile updated successfully."
      );

      await loadProfile();

    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      setError(
        error.message ||
          "Failed to update profile."
      );

    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-header">

        <h1>My Profile</h1>

        <p>
          View and manage your SupportSphere
          account information.
        </p>

      </div>

      <div className="profile-card">

        {/* =========================
            PROFILE HEADER
        ========================= */}

        <div className="profile-header">

          <div className="profile-avatar">
            {initial}
          </div>

          <div className="profile-title">

            <h2>{displayName}</h2>

            <span className="profile-role">
              {getRoleLabel()}
            </span>

          </div>

        </div>

        <hr />

        {/* =========================
            MESSAGES
        ========================= */}

        {message && (
          <p style={{ color: "green" }}>
            {message}
          </p>
        )}

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        {/* =========================
            PROFILE INFORMATION
        ========================= */}

        {!editing ? (

          <div className="profile-info">

            {/* USER ID */}

            <div className="profile-info-item">
              <strong>User ID</strong>
              <p>{user.userId}</p>
            </div>

            {/* FULL NAME */}

            <div className="profile-info-item">
              <strong>Full Name</strong>
              <p>
                {formData.name ||
                  "Not provided"}
              </p>
            </div>

            {/* EMAIL */}

            <div className="profile-info-item">
              <strong>Email</strong>
              <p>
                {formData.email ||
                  "Not provided"}
              </p>
            </div>

            {/* PHONE */}

            <div className="profile-info-item">
              <strong>Phone</strong>
              <p>
                {formData.phone ||
                  "Not provided"}
              </p>
            </div>

            {/* =========================
                CUSTOMER INFORMATION
            ========================= */}

            {user.role === "CUSTOMER" && (
              <>
                <div className="profile-info-item">
                  <strong>Company Name</strong>

                  <p>
                    {formData.companyName ||
                      "Not provided"}
                  </p>
                </div>

                <div className="profile-info-item">
                  <strong>Address</strong>

                  <p>
                    {formData.address ||
                      "Not provided"}
                  </p>
                </div>
              </>
            )}

            {/* =========================
                AGENT INFORMATION
            ========================= */}

            {user.role === "AGENT" && (
              <>
                <div className="profile-info-item">
                  <strong>Employee Code</strong>

                  <p>
                    {formData.employeeCode ||
                      "Not provided"}
                  </p>
                </div>

                <div className="profile-info-item">
                  <strong>Department</strong>

                  <p>
                    {formData.department ||
                      "Not provided"}
                  </p>
                </div>

                <div className="profile-info-item">
                  <strong>Availability Status</strong>

                  <p>
                    {getAgentStatusLabel()}
                  </p>
                </div>
              </>
            )}

            {/* ACCOUNT ROLE */}

            <div className="profile-info-item">
              <strong>Account Role</strong>

              <p>{getRoleLabel()}</p>
            </div>

          </div>

        ) : (

          <form onSubmit={handleSave}>

            <div className="profile-info">

              {/* FULL NAME */}

              <div className="profile-info-item">

                <strong>Full Name</strong>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* EMAIL */}

              <div className="profile-info-item">

                <strong>Email</strong>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* PHONE */}

              <div className="profile-info-item">

                <strong>Phone</strong>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />

              </div>

              {/* =========================
                  CUSTOMER EDIT FIELDS
              ========================= */}

              {user.role === "CUSTOMER" && (
                <>
                  <div className="profile-info-item">

                    <strong>Company Name</strong>

                    <input
                      type="text"
                      name="companyName"
                      value={
                        formData.companyName
                      }
                      onChange={handleChange}
                    />

                  </div>

                  <div className="profile-info-item">

                    <strong>Address</strong>

                    <input
                      type="text"
                      name="address"
                      value={
                        formData.address
                      }
                      onChange={handleChange}
                    />

                  </div>
                </>
              )}

              {/* =========================
                  AGENT INFORMATION
              ========================= */}

              {user.role === "AGENT" && (
                <>
                  <div className="profile-info-item">

                    <strong>Employee Code</strong>

                    <p>
                      {formData.employeeCode ||
                        "Not provided"}
                    </p>

                  </div>

                  <div className="profile-info-item">

                    <strong>Department</strong>

                    <p>
                      {formData.department ||
                        "Not provided"}
                    </p>

                  </div>

                  <div className="profile-info-item">

                    <strong>Availability Status</strong>

                    <p>
                      {getAgentStatusLabel()}
                    </p>

                  </div>
                </>
              )}

              {/* ACCOUNT ROLE */}

              <div className="profile-info-item">

                <strong>Account Role</strong>

                <p>{getRoleLabel()}</p>

              </div>

            </div>

            {/* =========================
                SAVE / CANCEL
            ========================= */}

            <div style={{ marginTop: "20px" }}>

              <button
                className="primary-button"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <button
                className="secondary-button"
                type="button"
                onClick={handleCancel}
                disabled={saving}
                style={{
                  marginLeft: "10px",
                }}
              >
                Cancel
              </button>

            </div>

          </form>

        )}

        {/* =========================
            ACCOUNT STATUS
        ========================= */}

        <div className="profile-status">

          <div>

            <strong>
              Account Status
            </strong>

            <p>
              Your account is currently active.
            </p>

          </div>

          <span className="profile-status-badge">
            Active
          </span>

        </div>

        {/* =========================
            EDIT BUTTON
        ========================= */}

        {!editing && (

          <button
            className="primary-button"
            type="button"
            onClick={handleEdit}
          >
            Edit Profile
          </button>

        )}

      </div>

    </DashboardLayout>
  );
}

export default Profile;