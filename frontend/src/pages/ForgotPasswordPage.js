import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [recovery, setRecovery] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
  
    try {
      const response = await axios.post("http://localhost:5000/api/users/forgot-password", { email, recovery });
  
      if (response.data.message === "Password sent by email. !") {
        setMessage("An email containing your password has been sent. !");
      } else {
        setMessage("Incorrect information.");
      }
    } catch (error) {
      setMessage("Server error or incorrect information.");
    }
  };  

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "20px",
      }}
    >
      {/* 🔹 Logo Marvel Store */}
      <img 
        src="/assets/mavelstorelogo.jpg" 
        alt="Marvel Store Logo" 
        style={{ width: "120px", marginBottom: "15px" }} 
      />

      {/* 📌 Forgot Password Block */}
      <div
        style={{
          backgroundColor: "#D7C4A1",
          padding: "30px",
          borderRadius: "12px",
          width: "350px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>

        {message && <p style={{ color: password ? "green" : "red" }}> {message} </p>}

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* 📨 Champ Email */}
          <div className="flex items-center bg-white text-black p-3 rounded mb-3">
            <Icon icon="mdi:email" width="24" className="mr-2" />
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent focus:outline-none"
              required
            />
          </div>

          {/* Recovery field */}
          <div className="flex items-center bg-white text-black p-3 rounded mb-3">
            <Icon icon="mdi:backup-restore" width="24" className="mr-2" />
            <input
              type="text"
              placeholder="Recovery Information"
              value={recovery}
              onChange={(e) => setRecovery(e.target.value)}
              className="w-full bg-transparent focus:outline-none"
              required
            />
          </div>

          {/* Validate button */}
          <button
            type="submit"
            className="bg-[#3E2F21] hover:bg-[#2D2116] text-white font-bold py-2 px-4 rounded flex items-center justify-center"
          >
            <Icon icon="mdi:send" width="20" className="mr-2" />
            To check
          </button>
        </form>
         

        {/* Link connection */}
        <p className="mt-3">
          <Link to="/login" className="text-[#3E2F21] hover:underline">
            <Icon icon="mdi:login" width="20" className="mr-1" />
            Back to connect
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
