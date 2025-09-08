import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/dashboard", { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => navigate("/"));
  }, [navigate]);

  const handleLogout = async () => {
    await axios.post("http://localhost:5000/auth/logout", {}, { withCredentials: true });
    navigate("/");
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {user ? (
        <>
          <p>Welcome {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Dashboard;
