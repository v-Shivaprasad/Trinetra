import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import Homemain from "./components/homepage/homemain";
import Dash from "./components/dashboard/dash";
import "bootstrap/dist/css/bootstrap.min.css";
const App = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true); // 👈 new

  const logout = async () => {
    try {
      await fetch("http://localhost:3001/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setEmail("");
    }
  };

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/auth/status", {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();

        if (data.authenticated) {
          setEmail(data.user.email);
        } else {
          const ref = await fetch("http://localhost:3001/api/users/refresh", {
            method: "POST",
            credentials: "include",
          });
          const r = await ref.json();
          if (!r.ok) {
            await logout();
            return;
          }
          setEmail(r.user.email);
        }
      } catch (err) {
        console.error(err);
        await logout();
      } finally {
        setLoading(false); // 👈 only decide routes after check
      }
    };

    check();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // 👈 temporary spinner or splash
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homemain />} />
        <Route
          path="/dash"
          element={email ? <Dash email={email} /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
};


export default App;
