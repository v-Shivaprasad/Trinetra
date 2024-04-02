import React, { useState } from "react";
import logo from "/Users/Dell/Desktop/trinetra/vite-project/src/assets/logo.jpg";
import AdminNav from "./AdminNav";
import Alerts from "./Alerts";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Projects from "../Projects";
import { useEffect } from "react";
import ManageAlerts from "./ManageAlerts";
import Profiles from "./profiles";

const Admin = () => {
  const [Rend, setRend] = useState("default");
  const Nafun = [
    {
      text: "SetAlerts",
      navfun: () => {
        setRend("ALERTS");
      },
    },

    {
      text: "Manage Alerts",
      navfun: () => {
        setRend("Manage");
      },
    },
    {
      text: "ViewProjects",
      navfun: () => {
        setRend("Projects");
        console.log("Projects");
      },
    },
    {
      text: "Show Profiles",
      navfun: () => {
        setRend("profiles");
      },
    },
  ];
  const [token, settoken] = useState(false);
  useEffect(() => {
    const Atoken = localStorage.getItem("Atoken");
    if (Atoken) {
      settoken(true);
    }
  }, [token]);

  const AdmRend = () => {
    switch (Rend) {
      case "ALERTS":
        return <Alerts />;

      case "Projects":
        return <Projects />;
      case "Manage":
        return <ManageAlerts />;
      case "profiles":
        return <Profiles />;

      default:
        return <img src={logo} style={{ maxWidth: "100vw" }} />;
    }
  };

  return (
    <>
      <AdminNav navLinks={Nafun} />
      {token && <AdmRend />}
    </>
  );
};

export default Admin;
