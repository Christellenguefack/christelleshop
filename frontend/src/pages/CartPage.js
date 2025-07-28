import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import axios from "axios";

const CartPage = () => {
  const [cart, setCart] = useState(() => {
    const local = JSON.parse(localStorage.getItem("cart"));
    return local ? { products: local } : { products: [] };
  });
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [address, setAddress] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    axios.get(`http://localhost:5000/api/cart/${user._id}`)
      .then(res => {
        const products = res.data?.products || [];
        setCart({ products });
        localStorage.setItem("cart", JSON.stringify(products));
      })
      .catch(err => console.error("Error cart :", err));

    axios.get(`http://localhost:5000/api/addresses`, { params: { userId: user._id } })
      .then(res => setSavedAddresses(res.data))
      .catch(err => console.error("Error address :", err));
  }, [user]);

  useEffect(() => {
    if (paymentMethod !== "paypal") return;

    const loadPayPalScript = () => {
      return new Promise((resolve, reject) => {
        if (document.getElementById("paypal-sdk")) return resolve();

        const script = document.createElement("script");
        script.src = "https://www.paypal.com/sdk/js?client-id=Aa1Ocb6Gn5RgWkO5LbrJ-HhoB5oMQ_JorMEiJ8XfU60xY3L8BcHbTGPaXoy4O4N5lEeuTai7n_Wap1WN&currency=EUR";
        script.id = "paypal-sdk";
        script.onload = () => resolve();
        script.onerror = (err) => reject(err);
        document.body.appendChild(script);
      });
    };

    loadPayPalScript().then(() => {
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: { value: getTotalPrice() }
              }]
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              alert("✅ PayPal payment confirmed by " + details.payer.name.given_name);
              handlePaypalSuccess();
            });
          }
        }).render("#paypal-button-container");
      }
    });
  }, [paymentMethod, cart]);

  const handlePaypalSuccess = async () => {
    try {
      await axios.post("http://localhost:5000/api/cart/updateStock", { cart });
      await axios.post("http://localhost:5000/api/orders/create", {
        userId: user._id,
        cart,
        address,
        paymentMethod: "paypal",
        total: getTotalPrice(),
      });
      await axios.post("http://localhost:5000/api/cart/clear", { userId: user._id });

      setCart({ products: [] });
      localStorage.removeItem("cart");

      localStorage.setItem("checkoutAddress", address);
      localStorage.setItem("paymentMethod", "paypal");
      localStorage.setItem("userId", user._id);

      navigate("/orders");
    } catch (err) {
      console.error("Error after PayPal payment :", err);
      alert("❌ An error occurred after payment..");
    }
  };

  const removeFromCart = async (product) => {
    try {
      await axios.post("http://localhost:5000/api/cart/remove", {
        userId: user._id,
        productId: product.productId._id || product.productId,
        color: product.color,
        size: product.size
      });

      const newCart = cart.products.filter(
        (item) =>
          !(
            item.productId._id === product.productId._id &&
            item.color === product.color &&
            item.size === product.size
          )
      );

      setCart({ products: newCart });
      localStorage.setItem("cart", JSON.stringify(newCart));
    } catch (error) {
      console.error("Deletion error :", error);
      alert("Error deleting product.");
    }
  };

  const getTotalPrice = () => {
    if (!Array.isArray(cart.products)) return 0;
    return cart.products.reduce((total, item) => {
      const price = item?.productId?.price || 0;
      const quantity = item?.quantity || 0;
      return total + price * quantity;
    }, 0).toFixed(2);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  };

  const handlePayment = async () => {
    if (!address) return alert("Select an address.");

    localStorage.setItem("checkoutAddress", address);
    localStorage.setItem("paymentMethod", paymentMethod);
    localStorage.setItem("userId", user._id);

    if (paymentMethod === "paypal") {
      window.location.href = "https://www.paypal.me/marvelstore1010";
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/stripe/create-checkout-session", {
        cart,
        userEmail: user.email,
      });

      window.location.href = response.data.url;
    } catch (err) {
      console.error("Payment error :", err);
      alert("Error during payment.");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar à gauche */}
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
              <Icon
                icon={item.icon}
                width="32"
                color={location.pathname === item.path ? "red" : "white"}
              />
            </Link>
          ))}
        </nav>

        {/* Barre utilisateur */}
        <div style={{ borderTop: "1px solid #444", paddingTop: "20px", textAlign: "center" }}>
          <h2 style={{ fontSize: "16px", marginBottom: "10px" }}>🛒 My Cart</h2>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Icon icon="mdi:account-circle" width="40" />
            {user ? (
              <>
                <span style={{ marginTop: "10px" }}>{user.name}</span>
                <button onClick={handleLogout} style={{ marginTop: "10px", backgroundColor: "red", color: "white", padding: "5px", borderRadius: "3px", fontSize: "12px" }}>Disconnection</button>
              </>
            ) : (
              <button onClick={() => navigate("/login")} style={{ marginTop: "10px", backgroundColor: "blue", color: "white", padding: "5px", borderRadius: "3px", fontSize: "12px" }}>Login</button>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: "250px", padding: "20px", backgroundImage: `url('/assets/christelleshopproduits.jpg')`, flexGrow: 1, color: "white" }}>
        {cart.products.length === 0 ? (
          <h2>Your basket is empty.</h2>
        ) : (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
              {cart.products.map((product, i) => (
                <div key={i} style={{ backgroundColor: "#222", margin: 10, padding: 10 }}>
                  <img src={`http://localhost:5000${product.productId?.image}`} alt={product.productId?.name} style={{ width: "180px", height: "150px" }} />
                  <h3>{product.productId?.name}</h3>
                  <p>Price : {product.productId?.price}€</p>
                  <p>Color : {product.color}</p>
                  <p>Size : {product.size}</p>
                  <p>Quantity : {product.quantity}</p>
                  <button onClick={() => removeFromCart(product)} style={{ backgroundColor: "red", color: "white" }}>Delete</button>
                </div>
              ))}
            </div>

            <div style={{ fontWeight: "bold", fontSize: "18px", marginTop: "20px" }}>
              Total : {getTotalPrice()} €
            </div>

            {/* Paiement */}
            <div style={{ backgroundColor: "#111", padding: 20, marginTop: 30, borderRadius: 10 }}>
              <h3>💳 Payment</h3>

              <label>Saved address:</label>
              <select value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: "60%", marginBottom: 20 }}>
                <option value="">-- Select address --</option>
                {savedAddresses.map((addr, i) => (
                  <option key={i} value={`${addr.fullName}, ${addr.address}, ${addr.city}`}>
                    {addr.fullName}, {addr.address}, {addr.city}
                  </option>
                ))}
              </select>

              <label>Payment method:</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ width: "30%", marginBottom: 20 }}>
                <option value="">-- Select method --</option>
                <option value="card">Card</option>
                <option value="paypal">PayPal</option>
              </select>

              {paymentMethod === "paypal" && (
                <div id="paypal-button-container" style={{ marginTop: 10 }}></div>
              )}

              <p>📦 Expected delivery : {getDeliveryDate()}</p>
              <button onClick={handlePayment} style={{ backgroundColor: "green", color: "white" }}>Pay</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CartPage;
