import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import axios from "axios";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
      fetchOrders(storedUser._id);
    }
  }, [navigate]);

  // Fetch orders
  const fetchOrders = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/user/${userId}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error retrieving orders:", error);
      alert("Error loading orders.");
    } finally {
      setLoading(false);
    }
  };

  // Cancel order
  const cancelOrder = async (orderId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
      console.log("Successful cancellation:", response.data.message);
      setOrders((prevOrders) => prevOrders.filter(order => order._id !== orderId));
    } catch (error) {
      console.error("Error cancelling:", error);
      alert("Error cancelling the order.");
    }
  };

  const getDeliveryDate = (createdAt) => {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + 2);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundImage: `url('/assets/christelleshopproduits.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "250px",
          backgroundColor: "#222",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "20px 10px",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 10,
        }}
      >
        {/* Navigation */}
        <nav style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
          {[
            { path: "/", icon: "mdi:home" },
            { path: "/products", icon: "mdi:shopping" },
            { path: "/cart", icon: "mdi:cart" },
            { path: "/orders", icon: "mdi:package-variant-closed" },
            { path: "/account", icon: "mdi:account" },
            { path: "/addresses", icon: "mdi:map-marker" },
          ].map((item) => (
            <Link key={item.path} to={item.path} style={{ textDecoration: "none" }}>
              <Icon
                icon={item.icon}
                width="32"
                color={location.pathname === item.path ? "red" : "white"}
              />
            </Link>
          ))}
        </nav>

        {/* User info */}
        <div style={{ borderTop: "1px solid #444", paddingTop: "20px", textAlign: "center" }}>
          <h2 style={{ fontSize: "16px", marginBottom: "10px" }}>📦 My Orders</h2>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Icon icon="mdi:account-circle" width="40" style={{ cursor: "pointer" }} />
            {user ? (
              <>
                <span style={{ marginTop: "10px", fontSize: "14px" }}>{user.name}</span>
                <button
                  onClick={handleLogout}
                  style={{
                    marginTop: "10px",
                    backgroundColor: "red",
                    color: "white",
                    padding: "5px",
                    borderRadius: "3px",
                    fontSize: "12px",
                  }}
                >
                  Disconnection
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                style={{
                  marginTop: "10px",
                  backgroundColor: "blue",
                  color: "white",
                  padding: "5px",
                  borderRadius: "3px",
                  fontSize: "12px",
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        style={{
          marginLeft: "250px",
          flexGrow: 1,
          padding: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: "20px",
            borderRadius: "10px",
            maxWidth: "1300px",
            width: "100%",
          }}
        >
          {loading ? (
            <p>Loading...</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
              }}
            >
              {orders.map((order) => (
                <div
                  key={order._id}
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <p>
                    <strong>ID :</strong> {order._id}
                  </p>
                  <p>
                    <strong>Total :</strong> {order.total || "-"} €
                  </p>
                  <p>
                    <strong>Address :</strong> {order.address?.street}, {order.address?.city}
                  </p>
                  <p>
                    <strong>Estimated delivery :</strong> {getDeliveryDate(order.createdAt)}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span>
                      <strong>Status :</strong> {order.status}
                    </span>
                    <span
                      style={{
                        display: "inline-block",
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor:
                          order.status === "Livery"
                            ? "green"
                            : new Date(order.deliveryDate) <= new Date()
                            ? "blue"
                            : "orange",
                      }}
                    ></span>
                  </div>

                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ marginLeft: "10px", marginTop: "5px" }}>
                      <p>- Product ID : {item.productId}</p>
                      <p>
                        Quantity : {item.quantity} / Color : {item.color} / Size : {item.size}
                      </p>
                    </div>
                  ))}

                  {order.status === "In progress" &&
                    new Date(order.deliveryDate) - new Date() > 24 * 60 * 60 * 1000 && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        style={{
                          marginTop: "10px",
                          padding: "5px",
                          backgroundColor: "orange",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                        }}
                      >
                        Cancel order
                      </button>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;
