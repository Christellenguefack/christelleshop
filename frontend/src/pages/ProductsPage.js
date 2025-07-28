import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Erreur :", error));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setSelectedColor("");
    setSize("");
    setQuantity(1);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  const addToCart = async () => {
    if (!selectedColor || !size || quantity < 1) {
      alert("Please fill in all fields before adding to basket..");
      return;
    }

    if (quantity > selectedProduct.stock) {
      alert("Insufficient stock !");
      return;
    }

    const cartMap = new Map(cart.map((item) => [`${item._id}-${item.color}-${item.size}`, item]));
    const key = `${selectedProduct._id}-${selectedColor}-${size}`;

    if (cartMap.has(key)) {
      cartMap.get(key).quantity += quantity;
    } else {
      cartMap.set(key, { ...selectedProduct, color: selectedColor, size, quantity });
    }

    const newCart = Array.from(cartMap.values());

    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    alert("Product add to cart !");
    closeProductModal();

    if (user) {
      try {
        await axios.post("http://localhost:5000/api/cart/add", {
          userId: user._id,
          productId: selectedProduct._id,
          color: selectedColor,
          size,
          quantity,
        });
      } catch (error) {
        console.error("Error adding to server cart :", error);
      }
    }
  };

  const getDeliveryDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    return today.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
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

        <div style={{ borderTop: "1px solid #444", paddingTop: "20px", textAlign: "center" }}>
          <h2 style={{ fontSize: "16px", marginBottom: "10px" }}>🛍️ The Best Products</h2>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Icon icon="mdi:account-circle" width="40" style={{ cursor: "pointer" }} />
            {user ? (
              <>
                <span style={{ marginTop: "10px", fontSize: "14px" }}>{user.name}</span>
                <button onClick={handleLogout} style={{ marginTop: "10px", backgroundColor: "red", color: "white", padding: "5px", borderRadius: "3px", fontSize: "12px" }}>Disconnection</button>
              </>
            ) : (
              <button onClick={() => navigate("/login")} style={{ marginTop: "10px", backgroundColor: "blue", color: "white", padding: "5px", borderRadius: "3px", fontSize: "12px" }}>Login</button>
            )}
          </div>
        </div>
      </aside>

      {/* Contenu principal */}
      <main style={{
        marginLeft: "250px",
        flexGrow: 1,
        backgroundImage: `url('/assets/christelleshopproduits.jpg')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        padding: "20px",
      }}>
        <h2>🛍️ Our Products</h2>

        <input
          type="text"
          placeholder="🔎 Search product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            marginBottom: "20px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "20px" }}>
          {products
            .filter((product) =>
              product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              product.description?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((product) => (
              <div key={product._id} style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px",
                backgroundColor: "#000",
                color: "#fff",
                cursor: "pointer"
              }} onClick={() => handleProductClick(product)}>
                {product.image && (
                  <img src={`http://localhost:5000${product.image}`} alt={product.name} style={{ width: "150px" }} />
                )}
                <h3>{product.name}</h3>
                <p>Price : {product.price}€</p>
                <p>Free Delivery : <strong>{getDeliveryDate()}</strong></p>
                <p>Description : {product.description}</p>
              </div>
            ))}
        </div>
      </main>

      {/* Modal */}
      {selectedProduct && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "60px",
            borderRadius: "50px",
            width: "200px",
            height: "450px"
          }}>
            <img src={`http://localhost:5000${selectedProduct.image}`} alt={selectedProduct.name} style={{ width: "100%" }} />
            <h2>{selectedProduct.name}</h2>
            <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "0px", alignItems: "center" }}>
              <label>Color :</label>
              <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
                <option value="">Select Color</option>
                {selectedProduct.colors.map((color) => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>

              <label>Size :</label>
              <select value={size} onChange={(e) => setSize(e.target.value)}>
                <option value="">Select size</option>
                {selectedProduct.sizes.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <label>Quantity :</label>
              <input
                type="number"
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{ width: "80%" }}
              />
              <p>Stock available : <strong>{selectedProduct.stock}</strong></p>

              <button onClick={addToCart} style={{ marginTop: "15px", backgroundColor: "green", color: "white", padding: "10px", borderRadius: "5px", width: "80%" }}>Add cart</button>
              <button onClick={closeProductModal} style={{ marginTop: "10px", backgroundColor: "red", color: "white", padding: "10px", borderRadius: "5px", width: "80%" }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
