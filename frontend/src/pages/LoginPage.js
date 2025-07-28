import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields. !");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:5000/api/users/login", { email, password });

      // Load user from localStorage 
      const user = response.data.user;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user._id);
      localStorage.setItem("userEmail", user.email);


      alert("Successful login !");
      navigate("/");
    } catch (error) {
      console.error("Full error :", error);
      setError(error.response?.data?.message || "Error logging in.");
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
        color: "#3E2F21",
      }}
    >
      {/* 🔹 Link Home and Product */}
      <div className="absolute top-4 right-4 flex gap-4">
        <Link to="/" className="text-white text-lg font-bold hover:underline">
          <Icon icon="mdi:home" width="24" className="mr-1" /> Home
        </Link>
        <Link to="/products" className="text-white text-lg font-bold hover:underline">
          <Icon icon="mdi:shopping" width="24" className="mr-1" /> Product
        </Link>
      </div>

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
        <img 
          src="/assets/mavelstorelogo.jpg" 
          alt="Marvel Store Logo" 
          style={{ width: "120px", marginBottom: "15px" }} 
        />

        <h2 className="text-2xl font-bold mb-4"> Connection</h2>

        {error && <p style={{ color: "red" }}>⚠️ {error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col">
         
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

          <button
            type="submit"
            disabled={loading}
            className="bg-[#3E2F21] hover:bg-[#2D2116] text-white font-bold py-2 px-4 rounded mt-2 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Icon icon="mdi:loading" width="20" className="mr-2 animate-spin" />
                Connection...
              </>
            ) : (
              <>
                <Icon icon="mdi:login" width="20" className="mr-2" />
                Sign in
              </>
            )}
          </button>
        </form>

        {/* 🔹 Link forgot password and inscription */}
        <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-[#3E2F21] hover:underline">
            <Icon icon="mdi:key" width="20" className="mr-1" />
            Forgot password ?
          </Link>
        </div>

        <p className="mt-3">
          No account yet. ?{" "}
          <Link to="/register" className="text-[#3E2F21] hover:underline">
            <Icon icon="mdi:account-plus" width="20" className="mr-1" />
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
