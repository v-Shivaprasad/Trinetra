import React, { useState, useEffect } from "react";
import { useAuth } from "../../store/Authmanage";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import PropTypes from "prop-types";

const Dnav = ({ navLinks, modalOps, svgColor, email }) => {
  const { islogin, setislogin, client, setclient } = useAuth();
  // const [email, setemail] = useState(" ");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if (!token) {
    useEffect(() => {
      localStorage.setItem("Trueshow", false);
      navigate("/");
    }, [navigate]);
  }
  const [modopen, setmodopen] = useState(false);

  const ShowModalOps = () => {
    setmodopen(!modopen);
    const drop = document.getElementById("dropdownMenuLink");

    if (drop) {
      const dropdown = new bootstrap.Dropdown(drop);
      if (!modopen) {
        dropdown.show();
      } else {
        dropdown.hide();
      }
    }
  };

  const [Profile, setProfile] = useState([]);
  const handleClick = (modalfun) => {
    modalfun();
  };
  const handleNavLinkClick = (navfun) => {
    navfun();
  };

  const profileDetails = async () => {
    try {
      const profile = await fetch(
        `http://localhost:3001/api/FindProfile?email=${email}`
      );
      const details = await profile.json();
      console.table(details);

      // Set the Profile state using a functional update to ensure the latest state
      setProfile((prevProfile) => [details]);

      // Return details if needed, although it's not used in your example
      return details;
    } catch (error) {
      console.error(error);
    }
  };
  const openProfileModal = () => {
    const profileModal = new bootstrap.Modal(
      document.getElementById("staticBackdrop")
    );
    profileDetails();
    profileModal.show();
  };
  const handlehome = () => {
    navigate("/");
  };
  return (
    <>
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
                      console.table(client);
                      handleNavLinkClick(link.navfun);
                    }}
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => {
              handlehome();
            }}
          >
            Home
          </button>

          <div className="ml-auto">
            {/* Right-aligned items */}
            <div
              className="btn-group dropdown-center"
              style={{ paddingRight: "30px", boxSizing: "border-box" }}
            >
              <button
                className="btn dropdown-toggle btn"
                role="button"
                id="dropdownMenuLink"
                // data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={ShowModalOps}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill={svgColor}
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
                {modalOps.map((link, index) => (
                  <li key={index}>
                    <a
                      onClick={() => {
                        handleClick(link.modalfun);
                        if (link.label === "Profile") {
                          // Call a function to open the modal here
                          openProfileModal();
                        }
                      }}
                      className="dropdown-item"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill={svgColor}
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
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {" "}
              {Profile.map((detail, index) => (
                <div key={index}>
                  <p>{`User Name: ${detail.Profile.name}`}</p>
                  <p>{`Email: ${detail.Profile.signemail}`}</p>
                  <p>{`Profession: ${detail.Profile.profession}`}</p>
                  <p>{`Institution: ${detail.Profile.institution}`}</p>
                  {/* Add more details as needed */}
                </div>
              ))}
            </div>
            <div className="modal-footer"></div>
          </div>
        </div>
      </div>
    </>
  );
};
Dnav.propTypes = {
  navLinks: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      navfun: PropTypes.func,
    })
  ).isRequired,

  modalOps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      modalfun: PropTypes.func,
    })
  ),
};

export default Dnav;
