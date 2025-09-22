import React, { useState, useEffect } from "react";
import { useAuth } from "../../store/Authmanage";
import { useNavigate, useNavigation } from "react-router-dom";
import Myproj from "./Myproj";
import Projects from "./Projects";
import Alerts from "./Hackathons";
import Dnav from "./dnav";

const Dash = ({email}) => {
  const navigate = useNavigate();
  const { islogin, setislogin, setshowbtn } = useAuth();
  // const [email, setemail] = useState("");
  const [rend, setrend] = useState();
  // logout clears cookies on backend
  const logout = async () => {
    try {
      await fetch("http://localhost:3001/api/users/logout", {
        method: "POST",
        credentials: "include", // ensure cookies are cleared
      });
      console.log("logg");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setislogin(false);
      setshowbtn(false);
      navigate("/");
    }
  };
console.log(email);
  // validate cookie and fetch user
  useEffect(() => {
    const validate = async () => {
      try {
        const resp = await fetch("http://localhost:3001/api/users/me", {
          method: "GET",
          credentials: "include", // send cookies automatically
        });

        if (!resp.ok) {
         const res =  await logout();
         console.log(res);
          return;
        }

        const data = await resp.json();
        console.table(data.user);
        // setemail(data.user.signemail);
        console.log(email);
        setislogin(true);
        setshowbtn(true);
      } catch (err) {
        console.error("Validation error:", err);
        logout();
      }
    };

    validate();
  }, []);



  // nav links
  const navLinks = [
    { text: "My Projects", navfun: () => setrend("Myproj") },
    { text: "Projects", navfun: () => setrend("Projects") },
    { text: "Alerts", navfun: () => setrend("Hack") },
  ];

  // modal options
  const modalOps = [
    { label: "Profile", modalfun: () => console.log("clicked") },
    { label: "Logout", modalfun: logout },
  ];

  // conditional rendering
  const RendComp = () => {
    switch (rend) {
      case "Myproj":
        return <Myproj email={email} />;
      case "Hack":
        return <Alerts email={email} />;
      case "Projects":
        return <Projects email={email} />;
      default:
        return <Myproj email={email} />;
    }
  };

  return (
    <>
      <Dnav
        navLinks={navLinks}
        modalOps={modalOps}
        svgColor={"green"}
        email={email}
      />
      {email && <RendComp />}
    </>
  );
};

export default Dash;
