import { createContext, useContext, useState } from "react";

const AuthManage = createContext();

export const AuthProvider = ({ children }) => {
  const [islogin, setislogin] = useState(false);

  const [token, settoken] = useState(sessionStorage.getItem("token"));
  const [showbtn, setshowbtn] = useState(false);

  const storetoken = (token) => {
    return sessionStorage.setItem("token", token);
  };

  return (
    <AuthManage.Provider
      value={{
        islogin,
        setislogin,
        storetoken,
        token,
        settoken,
        showbtn,
        setshowbtn,
      }}
    >
      {children}
    </AuthManage.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthManage);
};