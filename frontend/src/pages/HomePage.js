import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleViewProducts = () => {
    navigate('/products');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      backgroundImage: `url('/assets/homepage.jpg')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}>
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
        {/* Navigation */}
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

        {/* Informations utilisateur */}
        <div style={{ borderTop: "1px solid #444", paddingTop: "20px", textAlign: "center" }}>
          <h2 style={{ fontSize: "16px", marginBottom: "10px" }}>🛍️ Your Shop</h2>
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "20px",
        color: "#fff"
      }}>
        <div style={{ backgroundColor: "rgba(0,0,0,0.7)", padding: "20px", borderRadius: "10px", width: "80%", maxWidth: "400px" }}>
          <h1>Welcome to The Christelle Shop</h1>
          <p>Do your shopping at the best store of the moment. !</p>
          <button onClick={handleViewProducts}>Enter and enjoy</button>
          <p>Description:</p>
          <p>Welcome to the best shop of moment, enjoy the best unique branded products.</p>
          <p>We offer you many high quality products at low prices..</p>
          <p>ENTER AND ENJOY ! ! !</p>
        </div>
      </main>
    </div>
  );
}

export default HomePage;