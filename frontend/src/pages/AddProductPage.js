import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddProductPage = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [stock, setStock] = useState(""); 
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function size
  const handleSizeChange = (e) => {
    const selectedSizes = Array.from(e.target.selectedOptions, (option) => option.value);
    setSizes(selectedSizes);
  };

  // Function color
  const handleColorChange = (e) => {
    const selectedColors = Array.from(e.target.selectedOptions, (option) => option.value);
    setColors(selectedColors);
  };

  // Function Image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Function save
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !description || !category || sizes.length === 0 || colors.length === 0 || !stock || !image) {
      alert("Please fill in all fields.!");
      return;
    }

    if (price <= 0 || stock < 0) {
      alert("Price and stock must be greater than 0. !");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("category", category);
      sizes.forEach(size => formData.append("sizes[]", size));
      colors.forEach(color => formData.append("colors[]", color));
      formData.append("stock", stock);
      formData.append("image", image);

      await axios.post("http://localhost:5000/api/products/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product Added Successfully !");
      navigate("/products");
    } catch (error) {
      console.error("❌ Error :", error.response?.data?.message || "Problem server");
      alert("Error adding product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "20px",
      color: "#fff"
    }}>
      <h2>Add product</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", width: "300px" }}>
        <input type="text" placeholder="Name of product" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="number" placeholder="Price (€)" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />

        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select category</option>
          <option value="chaussures">Shoes</option>
          <option value="chaussures">Dress</option>
        </select>

        <select multiple onChange={handleSizeChange} required>
          {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>


        <select multiple onChange={handleColorChange} required>
          <option value="Rouge">Red</option>
          <option value="Bleu">Blue</option>
          <option value="Noir">Black</option>
          <option value="Blanc">White</option>
        </select>

        <input type="file" accept="image/*" onChange={handleImageChange} required />

        <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add"}</button>
      </form>
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
  );
};

export default AddProductPage;
