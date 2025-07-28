import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const SupportPage = () => {
  const [request, setRequest] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    alert("Your request has been sent. !");
  };

  return (
    <div style={{
        backgroundImage: `url('/assets/marvelstoreassitance.jpeg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
        color: "#fff"
      }}>

      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.7)",
          padding: "20px",
          borderRadius: "10px",
          width: "80%",
          maxWidth: "400px",
          marginTop: "20px",
        }}
      >
        <h2>📞 Customer Support</h2>
        <p><strong>Help Number :</strong> +393792182036</p>
        <p><strong>Email :</strong> rngasseu@gmail.com</p>
        
        <h3>❓ Frequently Asked Questions (FAQ)</h3>
        <details>
          <summary>🔄 How to change my personal information ?</summary>
          <p>Go to the 'My Account' page, then change your name, email, password, or phone number.</p>
        </details>
        <details>
          <summary>📦 How to view and manage my orders ?</summary>
          <p>Go to the "Orders" page to view your purchases, track your deliveries, or repurchase a product.</p>
        </details>
        <details>
          <summary>🏠 How do I view and change my address? ?</summary>
          <p>In the "Addresses" section, add, edit, or remove your shipping and billing addresses.</p>
        </details>
        <details>
          <summary>🚪 How to log out ?</summary>
          <p>At the top right, select "Sign Out".</p>
        </details>
        <details>
          <summary>🛒 How to buy an item ?</summary>
          <p>Add products to your basket, then proceed to checkout to complete your order.</p>
        </details>
        <details>
          <summary>🗑 How do I delete my account? ?</summary>
          <p>Send an email to marvelstore1010@gmail.com requesting the deletion of your account.</p>
        </details>
      </div>
      
      <h3>📩 Submit a request</h3>
        <label>Your message :</label>
        <textarea 
          value={request} 
          onChange={(e) => setRequest(e.target.value)} 
          style={{ width: "100%", height: "100px", marginTop: "10px" }}
        />
        <button
          onClick={() => {
            const subject = encodeURIComponent("Request client");
            const body = encodeURIComponent(request);
            window.location.href = `mailto:marvelstore1010@gmail.com?subject=${subject}&body=${body}`;
          }}
          style={{ marginTop: "10px" }}
        >
          Send
        </button>
      
        <div style={{ marginTop: "20px", backgroundColor: "rgba(0,0,0,0.7)", padding: "20px", borderRadius: "10px", width: "80%", maxWidth: "400px" }}>
          <h3>📌 Options to account</h3>
          <p><Link to="/orders" style={{ color: "white", textDecoration: "none" }}><Icon icon="mdi:package-variant-closed" width="24" /> My order</Link></p>
          <p><Link to="/account" style={{ color: "white", textDecoration: "none" }}><Icon icon="mdi:account" width="24" /> My Account</Link></p>
          <p><Link to="/" style={{ color: "white", textDecoration: "none" }}><Icon icon="mdi:home" width="24" /> Home</Link></p>
          <p><Link to="/addresses" style={{ color: "white", textDecoration: "none" }}><Icon icon="mdi:home-map-marker" width="24" /> My address</Link></p>
        </div>
    
      <button onClick={() => navigate("/products")} style={{ marginTop: "10px", backgroundColor: "gray" }}>
        ⬅ Back to product
      </button>
    </div>
  );
};

export default SupportPage;

