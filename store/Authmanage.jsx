import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthManage = createContext();

export const AuthProvider = ({ children }) => {
  const [islogin, setislogin] = useState(false);
  const [showbtn, setshowbtn] = useState(false);
  const [client, setClient] = useState(null);
  const [email, setEmail] = useState("");

  const checkAuthStatus = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3001/api/auth/status",
        {},
        { withCredentials: true }
      );

      if (res.status === 200 && res.data.authenticated) {
        setislogin(true);
        setshowbtn(true);
        setEmail(res.data.user.email);
      } else {
        setislogin(false);
        setshowbtn(false);
        setEmail("");
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      setislogin(false);
      setshowbtn(false);
      setEmail("");
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200 && response.data.ok) {
        setislogin(true);
        setshowbtn(true);
        setEmail(email);
        return true;
      } else {
        setislogin(false);
        setshowbtn(false);
        setEmail("");
        return false;
      }
    } catch (error) {
      console.error("Login failed:", error);
      setislogin(false);
      setshowbtn(false);
      setEmail("");
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:3001/api/users/logout", {}, { withCredentials: true });
      setislogin(false);
      setshowbtn(false);
      setEmail("");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthManage.Provider
      value={{
        islogin,
        setislogin,
        showbtn,
        setshowbtn,
        client,
        setClient,
        email,
        setEmail,
        login,
        logout,
      }}
    >
      {children}
    </AuthManage.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthManage);
};
