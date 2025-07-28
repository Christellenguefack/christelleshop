import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboardPage() {
  const API_URL = "http://localhost:5000/api";
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [carts, setCarts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [editingCart, setEditingCart] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);

  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    address: "",
    city: "",
    zipCode: "",
    country: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("email");

    if (email !== "rngasseu123@gmail.com") {
      navigate("/");
      return;
    }

    // Load all items
    fetch(`${API_URL}/admin/users?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch((error) => console.error("User loading error:", error));

    fetch(`${API_URL}/admin/orders?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);  // Vérifier si data est un tableau
      })
      .catch((error) => console.error("Orders Loading Error:", error));

    fetch(`${API_URL}/admin/carts?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        setCarts(Array.isArray(data) ? data : []);  // Vérifier si data est un tableau
      })
      .catch((error) => console.error("Cart loading error:", error));

    fetch(`${API_URL}/admin/addresses?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        setAddresses(Array.isArray(data) ? data : []);  // Vérifier si data est un tableau
      })
      .catch((error) => console.error("Address loading error:", error));
  }, [navigate]);

  const handleMarkAsDelivered = async (orderId) => {
    try {
      const email = localStorage.getItem("email");
      const res = await fetch(`${API_URL}/admin/order/${orderId}/status?email=${email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Livrée" }),
      });

      if (res.ok) {
        const data = await res.json();
        // Function updates the local status of orders
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "Livrée" } : order
          )
        );
      } else {
        console.error("Error on status change");
      }
    } catch (error) {
      console.error("❌ Network Error :", error);
    }
  };

  // Function delete
  const handleDelete = async (type, id) => {
    const email = localStorage.getItem("email");
    if (!window.confirm("Are you sure you want to delete this item? ?")) return;

    try {
      const res = await fetch(`${API_URL}/admin/${type}/${id}?email=${email}`, {
        method: "DELETE",
      });

      if (res.ok) {
        if (type === "user") setUsers((prev) => prev.filter((u) => u._id !== id));
        if (type === "order") setOrders((prev) => prev.filter((o) => o._id !== id));
        if (type === "cart") setCarts((prev) => prev.filter((c) => c._id !== id));
        if (type === "address") setAddresses((prev) => prev.filter((a) => a._id !== id));
      } else {
        console.error(`Deletion error ${type}`);
      }
    } catch (err) {
      console.error(`Network Error Deletion ${type}:`, err);
    }
  };

  // Function edit 
  const handleEditUser = (user) => {
    setEditingUser(user._id);
    setUserName(user.name);
    setUserEmail(user.email);
  };

  // Function save
  const handleSaveUser = async (userId) => {
    const email = localStorage.getItem("email");
    const updatedUser = { name: userName, email: userEmail };

    try {
      const res = await fetch(`${API_URL}/admin/user/${userId}?email=${email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (res.ok) {
        const updatedUserData = await res.json();
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, ...updatedUserData } : u
          )
        );
        setEditingUser(null);
      } else {
        console.error("Error updating");
      }
    } catch (err) {
      console.error("Network Error:", err);
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order._id);
    setOrderStatus(order.status);
  };

  const handleSaveOrder = async (orderId) => {
    const email = localStorage.getItem("email");
    const updatedOrder = { status: orderStatus };

    try {
      const res = await fetch(`${API_URL}/admin/order/${orderId}/status?email=${email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOrder),
      });

      if (res.ok) {
        const updatedOrderData = await res.json();
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, ...updatedOrderData } : order
          )
        );
        setEditingOrder(null);
      } else {
        console.error("Error updating status");
      }
    } catch (err) {
      console.error("Network Error:", err);
    }
  };

const handleEditCart = (cart) => {
  setEditingCart(cart._id);
  setCartProducts(cart.products);
};

const handleCartProductChange = (index, quantity) => {
  const updated = [...cartProducts];
  updated[index].quantity = quantity;
  setCartProducts(updated);
};

const handleSaveCart = async (cartId) => {
  const email = localStorage.getItem("email");
  try {
    const res = await fetch(`${API_URL}/admin/cart/${cartId}?email=${email}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products: cartProducts }),
    });
    if (res.ok) {
      setCarts((prev) =>
        prev.map((c) => (c._id === cartId ? { ...c, products: cartProducts } : c))
      );
      setEditingCart(null);
    }
  } catch (err) {
    console.error("Cart update error :", err);
  }
};

const handleEditAddress = (addr) => {
  setEditingAddress(addr._id);
  setAddressForm({
    address: addr.address,
    city: addr.city,
    zipCode: addr.zipCode,
    country: addr.country,
  });
};

const handleSaveAddress = async (addrId) => {
  const email = localStorage.getItem("email");
  try {
    const res = await fetch(`${API_URL}/admin/address/${addrId}?email=${email}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addressForm),
    });
    if (res.ok) {
      setAddresses((prev) =>
        prev.map((a) =>
          a._id === addrId ? { ...a, ...addressForm } : a
        )
      );
      setEditingAddress(null);
    }
  } catch (err) {
    console.error("Address Update Error :", err);
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      {/* Users */}
      <h2>Users</h2>
      <section style={{ marginTop: "40px" }}>
        {users && users.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td style={tdStyle}>
                    {editingUser === user._id ? (
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td style={tdStyle}>
                    {editingUser === user._id ? (
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td style={tdStyle}>{user.isAdmin ? "Admin" : "Client"}</td>
                  <td style={tdStyle}>
                    {editingUser === user._id ? (
                      <button
                        style={buttonStyle}
                        onClick={() => handleSaveUser(user._id)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        style={buttonStyle}
                        onClick={() => handleEditUser(user)}
                      >
                        Modify
                      </button>
                    )}
                    <button
                      style={{ ...buttonStyle, color: "red" }}
                      onClick={() => handleDelete("user", user._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found.</p>
        )}
      </section>

      {/* Orders */}
      <section style={{ marginTop: "40px" }}>
        <h2>Orders</h2>
        {orders && orders.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={thStyle}>ID Order</th>
                <th style={thStyle}>Total</th>
                <th style={thStyle}>Statue</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td style={tdStyle}>{order._id}</td>
                  <td style={tdStyle}>{order.total} €</td>
                  <td style={tdStyle}>
                    {editingOrder === order._id ? (
                      <select
                        value={orderStatus}
                        onChange={(e) => setOrderStatus(e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Livery">Livery</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    ) : (
                      order.status
                    )}
                  </td>
                  <td style={tdStyle}>
                    {editingOrder === order._id ? (
                      <button
                        style={buttonStyle}
                        onClick={() => handleSaveOrder(order._id)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        style={buttonStyle}
                        onClick={() => handleEditOrder(order)}
                      >
                        Modify
                      </button>
                    )}
                    <button
                      style={{ ...buttonStyle, color: "red" }}
                      onClick={() => handleDelete("order", order._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No orders found.</p>
        )}
      </section>

      {/* Cart */}
      <section style={{ marginTop: "40px" }}>
        <h2>Cart</h2>
        {carts && carts.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={thStyle}>ID Cart</th>
                <th style={thStyle}>Users</th>
                <th style={thStyle}>Number products</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {carts.map((cart) => (
                <tr key={cart._id}>
                  <td style={tdStyle}>{cart._id}</td>
                  <td style={tdStyle}>{cart.userId}</td>
                  <td style={tdStyle}>
                    {editingCart === cart._id ? (
                      <ul>
                        {cartProducts.map((prod, index) => (
                          <li key={prod.productId}>
                            {prod.productId} – 
                            <input
                              type="number"
                              min="1"
                              value={prod.quantity}
                              onChange={(e) =>
                                handleCartProductChange(index, parseInt(e.target.value))
                              }
                              style={{ width: "60px", marginLeft: "5px" }}
                            />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      `${cart.products.length} product`
                    )}
                  </td>
                  <td style={tdStyle}>
                    {editingCart === cart._id ? (
                      <button style={buttonStyle} onClick={() => handleSaveCart(cart._id)}>
                        Save
                      </button>
                    ) : (
                      <button style={buttonStyle} onClick={() => handleEditCart(cart)}>
                        Modify
                      </button>
                    )}
                    <button
                      style={{ ...buttonStyle, color: "red" }}
                      onClick={() => handleDelete("cart", cart._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No cart found.</p>
        )}
      </section>

      {/* Adresses */}
      <section style={{ marginTop: "40px" }}>
        <h2>Address</h2>
        {addresses && addresses.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Users</th>
                <th style={thStyle}>Address</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map((address) => (
                <tr key={address._id}>
                  <td style={tdStyle}>{address._id}</td>
                  <td style={tdStyle}>{address.user}</td>
                  <td style={tdStyle}>
                    {editingAddress === address._id ? (
                      <>
                        <input
                          placeholder="Address"
                          value={addressForm.address}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, address: e.target.value })
                          }
                        />
                        <input
                          placeholder="City"
                          value={addressForm.city}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, city: e.target.value })
                          }
                        />
                        <input
                          placeholder="Postal code"
                          value={addressForm.zipCode}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, zipCode: e.target.value })
                          }
                        />
                        <input
                          placeholder="Country"
                          value={addressForm.country}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, country: e.target.value })
                          }
                        />
                      </>
                    ) : (
                      `${address.address}, ${address.city}, ${address.zipCode}, ${address.country}`
                    )}
                  </td>
                  <td style={tdStyle}>
                    {editingAddress === address._id ? (
                      <button style={buttonStyle} onClick={() => handleSaveAddress(address._id)}>
                        Save
                      </button>
                    ) : (
                      <button style={buttonStyle} onClick={() => handleEditAddress(address)}>
                        Modify
                      </button>
                    )}
                    <button
                      style={{ ...buttonStyle, color: "red" }}
                      onClick={() => handleDelete("address", address._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No address found.</p>
        )}
      </section>

      <button
        onClick={() => navigate("/account")}
        style={{
          marginTop: "10px",
          backgroundColor: "gray",
          padding: "10px",
          borderRadius: "5px",
          color: "white",
          cursor: "pointer",
        }}
      >
        ⬅ Back to account
        </button>
</div>
); }

const tableStyle = { 
  borderCollapse: "collapse", 
  width: "100%", 
  marginTop: "10px", 
};

const thStyle = { 
  border: "1px solid #ddd", 
  padding: "10px", 
  backgroundColor: "#f9f9f9", 
};

const tdStyle = { 
  border: "1px solid #ddd", 
  padding: "10px", 
};

const buttonStyle = { 
  marginRight: "10px", 
  padding: "5px 10px", 
  backgroundColor: "#007BFF", 
  color: "white", border: "none", 
  borderRadius: "5px", 
  cursor: "pointer", 
};

export default AdminDashboardPage;
