import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = new URLSearchParams(location.search).get("email");

  useEffect(() => {
    const createOrder = async () => {
      if (!email) return;

      try {
        // 1. Appel pour envoyer l’email de confirmation
        await axios.post("http://localhost:5000/api/stripe/send-confirmation", { toEmail: email });

        // 2. Récupération des infos nécessaires
        const userId = localStorage.getItem("userId"); // Assurez-vous que userId est stocké dans le localStorage
        const paymentMethod = localStorage.getItem("paymentMethod");
        const address = localStorage.getItem("checkoutAddress"); // Corrigé le nom du champ ("Address" -> "checkoutAddress")

        if (!userId) {
          console.error("User ID is missing in localStorage.");
          return;
        }

        const cartResponse = await axios.get(`http://localhost:5000/api/cart/${userId}`);
        const cart = cartResponse.data;
        const total = cart.products.reduce((sum, p) => sum + p.productId.price * p.quantity, 0);

        const orderData = {
          userId,
          items: cart.products,
          address,
          paymentMethod,
          total,
        };

        // 3. Appel à la création de commande
        await axios.post("http://localhost:5000/api/orders/create", orderData);

        // 4. Vider le panier
        await axios.post("http://localhost:5000/api/cart/clear", { userId });
      } catch (err) {
        console.error("Erreur lors de la confirmation de commande :", err);
      }
    };

    createOrder();
  }, [email]);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>🎉 Payment Successfully!</h1>
      <p>Thank you for your order!</p>
      <p>A confirmation email has been sent to {email}</p>

      <button
        onClick={() => navigate("/cart")}
        style={{ marginTop: "10px", backgroundColor: "gray", padding: "10px", borderRadius: "5px", color: "white", cursor: "pointer" }}
      >
        ⬅ Back to cart
      </button>
    </div>
  );
};

export default SuccessPage;
