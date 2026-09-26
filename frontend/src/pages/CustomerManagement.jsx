import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { authenticatedFetch } from "../services/api";

function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [customerSearch, setCustomerSearch] = useState("");

  // =========================
  // LOAD CUSTOMERS
  // =========================

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await authenticatedFetch("/customers");
      const data = await response.json();

      console.log("Customers response:", data);

      setCustomers(data);
    } catch (error) {
      console.error(
        "Customers loading error:",
        error
      );

      setError(
        error.message || "Failed to load customers"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FILTER CUSTOMERS
  // =========================

  const filteredCustomers = customers.filter(
    (customer) => {
      const search =
        customerSearch.toLowerCase();

      const name =
        customer.user?.name?.toLowerCase() || "";

      const email =
        customer.user?.email?.toLowerCase() || "";

      const phone =
        customer.user?.phone?.toLowerCase() || "";

      const company =
        customer.companyName?.toLowerCase() || "";

      return (
        name.includes(search) ||
        email.includes(search) ||
        phone.includes(search) ||
        company.includes(search)
      );
    }
  );

  return (
    <DashboardLayout>

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-header">

        <h1>Customer Management</h1>

        <p>
          View and manage SupportSphere customers.
        </p>

      </div>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* =========================
          CUSTOMER MANAGEMENT
      ========================= */}

      <div className="recent-tickets">

        <h2>Customers</h2>

        {/* =========================
            SEARCH
        ========================= */}

        <div className="customer-search">

          <input
            type="text"
            placeholder="Search customers by name, email, phone or company..."
            value={customerSearch}
            onChange={(event) =>
              setCustomerSearch(
                event.target.value
              )
            }
          />

          <button
            type="button"
            onClick={() =>
              setCustomerSearch("")
            }
          >
            Clear
          </button>

        </div>

        {/* =========================
            LOADING
        ========================= */}

        {loading && (
          <p>Loading customers...</p>
        )}

        {/* =========================
            NO CUSTOMERS
        ========================= */}

        {!loading &&
          filteredCustomers.length === 0 && (
            <p>
              {customerSearch
                ? "No customers match your search."
                : "No customers found."}
            </p>
          )}

        {/* =========================
            CUSTOMER LIST
        ========================= */}

        {!loading &&
          filteredCustomers.length > 0 && (

            <div className="customer-management-list">

              {filteredCustomers.map(
                (customer) => (

                  <div
                    className="customer-management-card"
                    key={customer.customerId}
                  >

                    {/* CUSTOMER DETAILS */}

                    <div>

                      <strong>
                        {customer.user?.name ||
                          "Customer"}
                      </strong>

                      <p>
                        Email:{" "}
                        {customer.user?.email ||
                          "Not available"}
                      </p>

                      <p>
                        Phone:{" "}
                        {customer.user?.phone ||
                          "Not available"}
                      </p>

                      <p>
                        Company:{" "}
                        {customer.companyName ||
                          "Not specified"}
                      </p>

                      <p>
                        Address:{" "}
                        {customer.address ||
                          "Not specified"}
                      </p>

                    </div>

                    {/* ACTION */}

                    <div className="customer-management-actions">

                      <Link
                        to={`/tickets?customerId=${customer.customerId}`}
                      >
                        <button>
                          View Tickets
                        </button>
                      </Link>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

      </div>

    </DashboardLayout>
  );
}

export default CustomerManagement;