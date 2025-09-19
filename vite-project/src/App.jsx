import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import Homemain from "./components/homepage/homemain";
import Dash from "./components/dashboard/dash";

const App = () => {
  const [TrueLogin, setTrueLogin] = useState(false);
  const [email, setemail] = useState("");
  const logout = async () => {
    try {
      await fetch("http://localhost:3001/api/users/logout", {
        method: "POST",
        credentials: "include", // ensure cookies are cleared
      });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setemail("")
      // navigate("/");
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
      console.log("Status response:", data);

      if (data.authenticated) {
        // ✅ Access token is valid
        setemail(data.user.email);
      } else {
        // 🔄 Try refresh
        console.log("hereee");
        const ref = await fetch("http://localhost:3001/api/users/refresh", {
          method: "POST",
          credentials: "include",
        });
        const r = await ref.json();
        console.log(r);
        if (!r.ok) {
          await logout();
          return;
        }

        const refr = await ref.json();
        console.log("Refresh response:", refr);
        setemail(refr.user.email);
      }
    } catch (err) {
      console.error(err);
      await logout();
    }
  };

  check();
}, []);

useEffect(() => {
  if (email) {
    console.log("Updated email:", email);
  }
}, [email]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homemain />} />

        {!email && (
          <Route path="/dash" element={<Navigate to="/" replace />} />
        )}
        {email && <Route path="/dash" element={<Dash email={email}/>} />}
      </Routes>
    </Router>
  );
};

export default App;
