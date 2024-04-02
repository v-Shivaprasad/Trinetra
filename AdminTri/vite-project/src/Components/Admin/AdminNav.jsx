import React, { useState } from "react";
import logo from "/Users/Dell/Desktop/trinetra/vite-project/src/assets/logo.jpg";
import Adminmodal from "./Adminmodal";
const AdminNav = ({ navLinks }) => {
  const handleNavClick = (Navfun) => {
    Navfun();
  };

  const [showdrop, setshowdrop] = useState(false);
  const Dropdown = () => {
    setshowdrop(!showdrop);
    const dropdown = document.getElementById("dropdownMenuLink");
    const Drop = new bootstrap.Dropdown(dropdown);
    if (showdrop) {
      Drop.show();
    } else {
      Drop.hide();
    }
  };

  return (
    <div>
      <nav
        className="navbar fixed-top navbar-expand-lg navbar-light bg-light-subtle"
        style={{ padding: "0px 16px" }}
      >
        <a className="navbar-brand" href="#">
          <img
            src={logo}
            alt="Trinetra"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
          <span style={{ paddingLeft: "10px" }}>Trinetra</span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="mx-auto" style={{ alignItems: "center" }}>
            <ul className="navbar-nav">
              {/* Centered items with even space */}
              {navLinks.map((link, index) => (
                <li key={index} className="nav-link">
                  <a
                    onClick={() => {
                      handleNavClick(link.navfun);
                    }}
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="ml-auto">
            {/* Right-aligned items */}

            <div
              className="btn-group dropdown-center"
              style={{ paddingRight: "30px", boxSizing: "border-box" }}
            >
              <button
                onClick={Dropdown}
                className="btn dropdown-toggle btn"
                role="button"
                id="dropdownMenuLink"
                // data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="red"
                  className="bi bi-person-circle"
                  viewBox="0 0 16 16"
                  style={{ paddingTop: "2px" }}
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <path
                    fillRule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                  />
                </svg>
              </button>

              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuLink"
                style={{
                  paddingRight: "25px",
                }}
              >
                <li>
                  <a
                    className="dropdown-item"
                    data-bs-toggle="modal"
                    data-bs-target="#AdminModal" // Make sure this matches your modal ID
                  >
                    Login
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* <img src={logo} /> */}

      <Adminmodal />
    </div>
  );
};

export default AdminNav;
