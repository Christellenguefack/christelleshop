import React, { useState, useEffect } from "react"; 
import { Link, useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import { Icon } from "@iconify/react";

const italianCities = [
  { value: "Parma", label: "Parma" },
  { value: "Bologna", label: "Bologna" },
  { value: "Modena", label: "Modena" },
  { value: "Reggio Emilia", label: "Reggio Emilia" },
  { value: "Ferrara", label: "Ferrara" },
];

const AddressesPage = () => {
  const [country, setCountry] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [zipCode, setZipCode] = useState("");
  const [province, setProvince] = useState("");
  const [consent, setConsent] = useState(false);
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchAddresses(parsedUser._id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchAddresses = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/addresses?userId=${userId}`);
      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      console.error("Error retrieving addresses", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      alert("Error: User not logged in!");
      return;
    }

    if (!country || !fullName || !phoneNumber || !address || !selectedCity || !zipCode || !province) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          country,
          fullName,
          phoneNumber,
          address,
          city: selectedCity.value,
          zipCode,
          province,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Address saved!");
        fetchAddresses(user._id);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error adding address:", error);
      alert("An error occurred.");
    }
  };

  const handleDelete = async (id) => {
    if (!id || !user || !user._id) {
      alert("Error: User not logged in!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/addresses/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ userId: user._id }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error deleting address");

      setAddresses((prev) => prev.filter((addr) => addr._id !== id));
      alert("Address deleted!");
    } catch (error) {
      console.error("Delete error:", error.message);
      alert(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      backgroundImage: `url('/assets/christelleshopproduits.jpg')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      {/* Sidebar on the left */}
      <aside style={{
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
      }}>
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
              <Icon icon={item.icon} width="32" color={location.pathname === item.path ? "red" : "white"} />
            </Link>
          ))}
        </nav>
        <div style={{ borderTop: "1px solid #444", paddingTop: "20px", textAlign: "center" }}>
          <h2 style={{ fontSize: "16px", marginBottom: "10px" }}>📍 Address Book</h2>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Icon icon="mdi:account-circle" width="40" style={{ cursor: "pointer" }} />
            {user ? (
              <>
                <span style={{ marginTop: "10px", fontSize: "14px" }}>{user.name}</span>
                <button onClick={handleLogout} style={{ marginTop: "10px", backgroundColor: "red", color: "white", padding: "5px", borderRadius: "3px", fontSize: "12px" }}>Logout</button>
              </>
            ) : (
              <button onClick={() => navigate("/login")} style={{ marginTop: "10px", backgroundColor: "blue", color: "white", padding: "5px", borderRadius: "3px", fontSize: "12px" }}>Login</button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        marginLeft: "250px",
        flexGrow: 1,
        padding: "40px 20px",
        color: "#fff"
      }}>
        <div style={{ backgroundColor: "rgba(0,0,0,0.6)", padding: "20px", borderRadius: "10px", maxWidth: "600px", margin: "auto" }}>
          <h2>🏠 My Address</h2>
          <p>Add or update your delivery address</p>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <select value={country} onChange={(e) => setCountry(e.target.value)} required>
              <option value="">Select a country</option>
              <option value="Italy">Italy</option>
            </select>
            <input type="text" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <input type="tel" placeholder="Phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
            <Select options={italianCities} value={selectedCity} onChange={setSelectedCity} placeholder="Select a city" isSearchable />
            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            <input type="text" placeholder="Postal code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />
            <input type="text" placeholder="Province" value={province} onChange={(e) => setProvince(e.target.value)} required />
            <label>
              <input type="checkbox" checked={consent} onChange={() => setConsent(!consent)} required /> I agree this address will be used for delivery.
            </label>
            <button type="submit">Save address</button>
          </form>

          <h3 style={{ marginTop: "30px" }}>📋 My Addresses</h3>
          {addresses.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {addresses.map((addr) => (
                <li key={addr._id} style={{ marginBottom: "10px" }}>
                  {addr.fullName} - {addr.address}, {addr.city} ({addr.zipCode})
                  <button onClick={() => handleDelete(addr._id)} style={{ marginLeft: "10px", backgroundColor: "darkred", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px" }}>Delete</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No address saved.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default AddressesPage;
