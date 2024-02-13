import React, { useState, useEffect } from "react";
import { useAuth } from "../../store/Authmanage";
import { useNavigate } from "react-router-dom";
import Myproj from "./Myproj";
import Projects from "./Projects";
import Alerts from "./Hackathons";
import PopularProjects from "./PopularProjects";
import Dnav from "./dnav";

const Dash = () => {
  // const [email, setemail] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [rend, setrend] = useState();
  console.log("dash");
  const { islogin, setislogin, setshowbtn } = useAuth();
  const [email, setemail] = useState("");
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.setItem("Trueshow", false);
    navigate("/");
  };
  console.log(token);
  if (!token) {
    localStorage.setItem("Trueshow", false);
  }

  useEffect(() => {
    // Your existing code for validating token and setting email
    const validate = async (token) => {
      try {
        const resp = await fetch(
          `http://localhost:3001/api/ValidateToken?token=${token}`
        );
        const respo = await resp.json();
        const Email = await respo.decoded.email;

        setemail(Email);
      } catch (err) {
        console.log(err);
      }
    };

    if (token) {
      validate(token);
    } else {
      localStorage.setItem("Trueshow", false);
      localStorage.removeItem("token");
      logout(); // Use the logout function from useAuth
      navigate("/");
    }
  }, [token, logout, navigate]);

  // Use another useEffect for logging the updated email
  useEffect(() => {
    console.log(email);
  }, [email]);

  useEffect(() => {
    if (email === null) {
      logout();
      localStorage.removeItem("token");
      setislogin(false);
      navigate("/");
    }
  }, [email, navigate, setislogin]);

  const navLinks = [
    {
      text: "My Projects",
      navfun: () => {
        setrend("Myproj");
      },
    },
    {
      text: "Projects",
      navfun: () => {
        setrend("Projects");
      },
    },
    {
      text: "Alerts",
      navfun: () => {
        setrend("Hack");
      },
    },
    {
      text: "Popular Projects",
      navfun: () => {
        setrend("Popular");
      },
    },
  ];
  const modalOps = [
    {
      label: "Profile",
      modalfun: () => {
        console.log("clicked");
      },
    },
    {
      label: "Logout",
      modalfun: () => {
        setislogin(false);
        setshowbtn(false);
        logout();
      },
    },
  ];
  // Default to "Myproj" or any default component
  const RendComp = () => {
    switch (rend) {
      case "Myproj":
        return <Myproj email={email} />;
      case "Hack":
        return <Alerts email={email} />;
      case "Popular":
        return <PopularProjects email={email} />;
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
