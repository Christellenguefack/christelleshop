import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import axios from "axios";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState(""); 
  const [recovery, setRecovery] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !number || !recovery) {
      setError("Please fill in all fields. !");
      return;
    }

    setLoading(true);
    setError(null);

    console.log("Data sent :", { name, email, password, number, recovery });

    try {
      const response = await axios.post("http://localhost:5000/api/users/register", { 
        name, email, password, number, recovery
      });
      
      alert("Successful registration!");
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Error during registration.");
    } finally {
      setLoading(false);
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
      <img 
        src="/assets/mavelstorelogo.jpg" 
        alt="Marvel Store Logo" 
        style={{ width: "120px", marginBottom: "15px" }} 
      />

      {/* Connection Block */}
      <div
        style={{
          backgroundColor: "#D7C4A1", 
          padding: "30px",
          borderRadius: "12px",
          width: "350px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h2 className="text-2xl font-bold mb-4"> Registration </h2>

        {error && <p style={{ color: "red" }}>⚠️ {error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Name field */}
          <div className="flex items-center bg-white text-black p-3 rounded mb-3">
            <Icon icon="mdi:account" width="24" className="mr-2" />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent focus:outline-none"
              required
            />
          </div>

          {/* Email field */}
          <div className="flex items-center bg-white text-black p-3 rounded mb-3">
            <Icon icon="mdi:email" width="24" className="mr-2" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent focus:outline-none"
              required
            />
          </div>

          {/* Number field */}
          <div className="flex items-center bg-white text-black p-3 rounded mb-3">
            <Icon icon="mdi:phone" width="24" className="mr-2" />
            <input
              type="text"
              placeholder="Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full bg-transparent focus:outline-none"
              required
            />
          </div>

          {/* Recovery field */}
          <div className="flex items-center bg-white text-black p-3 rounded mb-3">
            <Icon icon="mdi:backup-restore" width="24" className="mr-2" />
            <input
              type="text"
              placeholder="Recovery"
              value={recovery}
              onChange={(e) => setRecovery(e.target.value)}
              className="w-full bg-transparent focus:outline-none"
              required
            />
          </div>

          {/* Forgot password field */}
          <div className="flex items-center bg-white text-black p-3 rounded mb-3">
            <Icon icon="mdi:lock" width="24" className="mr-2" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent focus:outline-none"
              required
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#3E2F21] hover:bg-[#2D2116] text-white font-bold py-2 px-4 rounded mt-2 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Icon icon="mdi:loading" width="20" className="mr-2 animate-spin" />
                Registration...
              </>
            ) : (
              <>
                <Icon icon="mdi:account-plus" width="20" className="mr-2" />
                Sign in
              </>
            )}
          </button>
        </form>

        {/* 🔹 Link to connect */}
        <p className="mt-3">
          Already have an account ?{" "}
          <Link to="/login" className="text-[#3E2F21] hover:underline">
            <Icon icon="mdi:login" width="20" className="mr-1" />
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
