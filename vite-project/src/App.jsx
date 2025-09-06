import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Homemain from "./components/homepage/homemain";
import Dash from "./components/dashboard/dash";

const App = () => {
  const [TrueLogin, setTrueLogin] = useState(false);
  const [email, setemail] = useState("");
  const [Token, setToken] = useState(localStorage.getItem("token"));

useEffect(() => {
  const checkLogin = async () => {
    try {
      const resp = await fetch("http://localhost:3001/api/users/me", {
        credentials: "include", // important to send cookies
      });
      if (resp.ok) {
        const data = await resp.json();
        setTrueLogin(true);
        setemail(data.user.signemail);
      } else {
        // try refresh token
        const refreshResp = await fetch(
          "http://localhost:3001/api/users/refresh",
          { credentials: "include" }
        );
        if (refreshResp.ok) {
          // retry /users/me after refresh
          const retryResp = await fetch("http://localhost:3001/api/users/me", {
            credentials: "include",
          });
          if (retryResp.ok) {
            const data = await retryResp.json();
            setTrueLogin(true);
            setemail(data.user.signemail);
          } else {
            setTrueLogin(false);
          }
        } else {
          setTrueLogin(false);
        }
      }
    } catch (error) {
      console.log(error);
      setTrueLogin(false);
    }
  };

  checkLogin();
}, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homemain />} />

        {!TrueLogin && (
          <Route path="/dash" element={<Navigate to="/" replace />} />
        )}
        {TrueLogin && <Route path="/dash" element={<Dash />} />}
      </Routes>
    </Router>
  );
};

export default App;
