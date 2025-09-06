import { createContext, useContext, useState,useEffect } from "react";

const AuthManage = createContext();

export const AuthProvider = ({ children }) => {
  const [islogin, setislogin] = useState(false);
  const [showbtn, setshowbtn] = useState(false);
  const [client, setClient] = useState(null);

    // Check auth from backend
useEffect(() => {
  fetch("http://localhost:3001/api/auth/status", {
    method: "GET",
    credentials: "include",
  })
    .then(async (res) => {
      if (!res.ok) {
        setislogin(false);
        setshowbtn(false);
        return;
      }

      const data = await res.json();

      if (data.authenticated) {
        setislogin(true);
        setshowbtn(true);
      } else {
        setislogin(false);
        setshowbtn(false);
      }
    })
    .catch(() => {
      setislogin(false);
      setshowbtn(false);
    });
}, []);

  return (
    <AuthManage.Provider
      value={{
        islogin,
        setislogin,
        showbtn,
        setshowbtn,
        client, 
        setClient,    
      }}
    >
      {children}
    </AuthManage.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthManage);
};
