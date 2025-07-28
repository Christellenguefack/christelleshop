import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Icon } from "@iconify/react";

const AccountPage = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "", number: "" });
  const [editMode, setEditMode] = useState({ name: false, email: false, password: false, number: false });
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || !storedUser.email) return;

        const response = await axios.get(`http://localhost:5000/api/users/user/${storedUser.email}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("❌ Error loading account:", error);
      }
    };
    fetchUser();
  }, []);

  const handleEditToggle = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/user/${user.email}`, user, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("✅ Saved changes!");
    } catch (error) {
      console.error("❌ Error Saving:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundImage: "url('/assets/christelleshopproduits.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#fff",
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
        <nav style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
          {[
            { path: "/", icon: "mdi:home" },
            { path: "/products", icon: "mdi:shopping" },
            { path: "/cart", icon: "mdi:cart" },
            { path: "/orders", icon: "mdi:package-variant-closed" },
            { path: "/account", icon: "mdi:account" },
            { path: "/addresses", icon: "mdi:map-marker" },
          ].map((item) => (
            <Link key={item.path} to={item.path}>
              <Icon icon={item.icon} width="32" color={location.pathname === item.path ? "red" : "white"} />
            </Link>
          ))}
          {user.email === "christellenguefack80@gmail.com" && (
            <>
              <Link to="/admin"><Icon icon="mdi:shield-account" width="32" color={location.pathname === "/admin" ? "red" : "white"} /></Link>
              <Link to="/add-product"><Icon icon="mdi:plus-box" width="32" color={location.pathname === "/add-product" ? "red" : "white"} /></Link>
            </>
          )}
        </nav>

        {/* User info */}
        <div style={{ borderTop: "1px solid #444", paddingTop: "20px", textAlign: "center" }}>
          <h2 style={{ fontSize: "16px", marginBottom: "10px" }}>🛍️ Account</h2>
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

      {/* Main Content */}
      <main style={{ marginLeft: "250px", padding: "40px", flexGrow: 1 }}>
        <h2>👤 My account</h2>
        {message && <p style={{ color: message.includes("❌") ? "red" : "green" }}>{message}</p>}

        <div style={{ backgroundColor: "rgba(0,0,0,0.7)", padding: "20px", borderRadius: "10px", width: "100%", maxWidth: "400px" }}>
          <label>Name:</label>
          {editMode.name ? (
            <input type="text" name="name" value={user.name} onChange={handleChange} />
          ) : (
            <p>{user.name} <button onClick={() => handleEditToggle("name")}>✏ Modifier</button></p>
          )}

          <label>Email:</label>
          {editMode.email ? (
            <input type="text" name="email" value={user.email} onChange={handleChange} />
          ) : (
            <p>{user.email} <button onClick={() => handleEditToggle("email")}>✏ Modifier</button></p>
          )}

          <label>Password:</label>
          {editMode.password ? (
            <input type="password" name="password" value={user.password} onChange={handleChange} />
          ) : (
            <p>******** <button onClick={() => handleEditToggle("password")}>✏ Modifier</button></p>
          )}

          <label>Number:</label>
          {editMode.number ? (
            <input type="text" name="number" value={user.number} onChange={handleChange} />
          ) : (
            <p>{user.number || "Non renseigné"} <button onClick={() => handleEditToggle("number")}>✏ Modifier</button></p>
          )}

          <button onClick={handleSave} style={{ marginTop: "15px", backgroundColor: "green", color: "white", padding: "10px", borderRadius: "5px", width: "100%" }}>
            💾 Save
          </button>
        </div>

        <div style={{ marginTop: "20px", backgroundColor: "rgba(0,0,0,0.7)", padding: "20px", borderRadius: "10px", width: "100%", maxWidth: "400px" }}>
          <h3>📌 Options to account</h3>
          <p><Link to="/orders" style={{ color: "white", textDecoration: "none" }}><Icon icon="mdi:package-variant-closed" width="24" /> My orders</Link></p>
          <p><Link to="/support" style={{ color: "white", textDecoration: "none" }}><Icon icon="mdi:help-circle" width="24" /> Customer Support</Link></p>
          <p><Link to="/" style={{ color: "white", textDecoration: "none" }}><Icon icon="mdi:home" width="24" /> Home</Link></p>
          <p><Link to="/addresses" style={{ color: "white", textDecoration: "none" }}><Icon icon="mdi:home-map-marker" width="24" /> My address</Link></p>
        </div>

        <button onClick={() => navigate("/products")} style={{ marginTop: "20px", backgroundColor: "gray", color: "white", padding: "10px", borderRadius: "5px", width: "100%", maxWidth: "400px" }}>
          ⬅ Back to Products
        </button>
      </main>
    </div>
  );
};

export default AccountPage;
