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
  const [Token, setToken] = useState(sessionStorage.getItem("token"));

  useEffect(() => {
    // const token = sessionStorage.getItem("token");

    const islogin = sessionStorage.getItem("Trueshow");

    const validate = async (Token, islogin) => {
      try {
        const resp = await fetch(
          `http://localhost:3001/api/ValidateToken?token=${Token}`
        );
        const respo = await resp.json();
        console.log(respo);
        const Mtoken = respo.validToken;
        setemail(respo.decoded);

        if (Mtoken && islogin) {
          setTrueLogin(true);
        } else {
          setTrueLogin(false);
          sessionStorage.removeItem("token");
          setToken(null);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (Token != undefined || Token != " ") {
      validate(Token, islogin);
    }
    // setTrueLogin((prevTrueLogin) => {
    //   if (token) {
    //     validate(token, islogin);
    //     return prevTrueLogin; // Keep the current state value until the new state is determined
    //   } else {
    //     sessionStorage.removeItem("token");
    //     sessionStorage.removeItem("Trueshow");
    //     return false;
    //   }
    // });
  }, [Token]); // Removed token from the dependency array

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
