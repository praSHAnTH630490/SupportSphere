import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { authenticatedFetch } from "../services/api";

function CreateTicket() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      setCategoryError("");

      const response = await authenticatedFetch("/categories");

      const data = await response.json();

      console.log("CATEGORIES FROM BACKEND:", data);

      setCategories(data);

      if (data.length > 0) {
        setCategoryId(String(data[0].categoryId));
      }
    } catch (error) {
      console.error("Category loading error:", error);

      setCategoryError(
        error.message || "Failed to load categories"
      );
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    if (!categoryId) {
      setError("Please select a category.");
      setLoading(false);
      return;
    }

    try {
      const response = await authenticatedFetch(
        "/tickets",
        {
          method: "POST",
          body: JSON.stringify({
            subject,
            description,
            priority,
            category: {
              categoryId: Number(categoryId)
            }
          })
        }
      );

      const data = await response.json();

      console.log("Created ticket:", data);

      navigate("/tickets");
    } catch (error) {
      console.error("Create ticket error:", error);

      setError(
        error.message || "Failed to create ticket"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Create New Ticket</h1>

        <p>
          Submit a support request to our team.
        </p>
      </div>

      <div className="ticket-form-container">
        <form onSubmit={handleSubmit}>

          {/* Subject */}
          <div className="form-group">
            <label>Subject</label>

            <input
              type="text"
              value={subject}
              onChange={(event) =>
                setSubject(event.target.value)
              }
              placeholder="Enter ticket subject"
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Describe your issue"
              rows="6"
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category</label>

            {categoriesLoading ? (
              <p>Loading categories...</p>
            ) : categoryError ? (
              <p style={{ color: "red" }}>
                {categoryError}
              </p>
            ) : (
              <select
                value={categoryId}
                onChange={(event) =>
                  setCategoryId(event.target.value)
                }
                required
              >
                <option value="">
                  Select Category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.categoryId}
                    value={category.categoryId}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Priority */}
          <div className="form-group">
            <label>Priority</label>

            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value)
              }
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <p style={{ color: "red" }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="primary-button"
            disabled={
              loading ||
              categoriesLoading ||
              categories.length === 0
            }
          >
            {loading
              ? "Creating Ticket..."
              : "Submit Ticket"}
          </button>

        </form>
      </div>
    </DashboardLayout>
  );
}

export default CreateTicket;