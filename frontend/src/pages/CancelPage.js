import React from "react";
import { useNavigate } from "react-router-dom";

// Function cancel
const CancelPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>❌ Payment cancelled</h1>
      <p>Your order has not been finalised..</p>

      <button
        onClick={() => navigate("/cart")}
        style={{ marginTop: "10px", backgroundColor: "gray", padding: "10px", borderRadius: "5px", color: "white", cursor: "pointer" }}
      >
        ⬅ Back to cart
      </button>
    </div>
  );
};

export default CancelPage;
