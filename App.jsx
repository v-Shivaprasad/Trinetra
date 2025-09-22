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
import { useAuth } from "./store/Authmanage";

const App = () => {
  const { islogin, email, checkAuthStatus } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      await checkAuthStatus();
      setLoading(false);
    };

    check();
  }, [checkAuthStatus]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homemain />} />
        <Route
          path="/dash"
          element={islogin ? <Dash email={email} /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
