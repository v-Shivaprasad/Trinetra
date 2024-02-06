import React, { useState } from "react";
import logo from "/Users/Dell/Desktop/trinetra/vite-project/src/assets/logo.jpg";
import Loginmodal from "./loginmodal";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import PropTypes from "prop-types";
import { Link } from "react-scroll";
import { useAuth } from "../../store/Authmanage";
import { Navigate, useNavigate } from "react-router-dom";
import "../homepage/navbar.css";

const Navbar = ({ navLinks, modalOps, svgcolor }) => {
  const { showbtn, setshowbtn } = useAuth();
  const token = sessionStorage.getItem("token");
  if (token) {
    setshowbtn(true);
  } else {
    setshowbtn(false);
  }
  const [OTP, setOTP] = useState({
    otp: "",
  });
  const settingotp = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setOTP((prevOTP) => ({
      ...prevOTP,
      [id]: value,
    }));
  };
  const [modopen, setmodopen] = useState(false);
  const [user, setUser] = useState({
    name: "",
    signemail: "",
    profession: "",
    signpassword: "",
    conpass: "",
    institution: "Default",
  });

  const navigate = useNavigate();
  const handleDash = () => {
    console.log("clicked");
    navigate("/dash");
  };

  const handleInput = (e) => {
    let name = e.target.id;
    let value = e.target.value;

    if (name === "profession") {
      // If the selected profession is "Student" or "Teacher", show the institution field
      const showInstitution = value === "Student" || value === "Teacher";
      setUser((prevUser) => ({
        ...prevUser,
        [name]: value,
        // Show/hide the institution field based on the selected profession
        institution: showInstitution ? prevUser.institution : "Default",
        // institution: value === "Default" ? "Default" : prevUser.institution,
      }));
    } else {
      // For other fields, update the user state as usual
      setUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
  };

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

  const handleForm = async (e) => {
    e.preventDefault();
    console.log(user);
    if (user.profession !== "") {
      if (user.signpassword === user.conpass) {
        try {
          // Check if the email already exists in the database
          const emailCheckResponse = await fetch(
            `http://localhost:3001/api/users/check-email?email=${user.signemail}`
          );

          if (!emailCheckResponse.ok) {
            const errorData = await emailCheckResponse.json();
            document.getElementById("emailError").innerHTML =
              "Email already exits";
            alert("Email already exists");
            console.log(emailCheckResponse);
            document.getElementById("closebutton").click();
            return; // Stop registration if email check fails
          }

          const initiateReg = await fetch(
            `http://localhost:3001/api/users/initiateReg?email=${user.signemail}`
          );
          if (!initiateReg.ok) {
            console.log(emailCheckResponse);
            document.getElementById("closebutton").click();
            return; // Stop registration if email check fails
          }
          document.getElementById("signupClose").click();
          const Otpmodal = document.getElementById("OTPmodal");
          const otpmodal = new bootstrap.Modal(Otpmodal);
          otpmodal.show();
        } catch (error) {
          console.log("Error", error);
        }
      } else {
        document.getElementById("passnomatch").innerHTML =
          "Passwords do not match";
      }
    } else {
      document.getElementById("professionError").innerHTML =
        "This field cannot be left empty";
    }
  };

  const Otpcheck = async (e) => {
    e.preventDefault();
    try {
      const otpcheck = await fetch(
        `http://localhost:3001/api/users/validateOtp?otp=${OTP.otp}`
      );

      console.log(otpcheck);
      if (!otpcheck.ok) {
        document.getElementById("otpclose").click();
        alert("Otp validation error");
        console.log(otpcheck);
        return;
      }
      const registrationResponse = await fetch(
        "http://localhost:3001/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

      if (!registrationResponse.ok) {
        // Handle HTTP error
        throw new Error(`HTTP error! Status: ${registrationResponse.status}`);
      }

      const responseData = await registrationResponse.json();
      console.log(responseData);
      if (responseData.ok) {
        setOTP({
          otp: "",
        });
        document.getElementById("otpclose").click();
        document.getElementById("closebutton").click();
        setUser({
          name: "",
          signemail: "",
          profession: "",
          signpassword: "",
          conpass: "",
        });

        console.log(responseData);

        const toast = document.getElementById("registrationtoast");
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
      } else {
        const errorData = await registrationResponse.json();
        console.log(errorData);
        setOTP({
          otp: "",
        });
        document.getElementById("otpclose").click();
        document.getElementById("closebutton").click();
        setUser({
          name: "",
          signemail: "",
          profession: "",
          signpassword: "",
          conpass: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clearFields = (e) => {
    // console.log(islogin);
    e.preventDefault();
    setUser({
      name: "",
      signemail: "",
      profession: "",
      signpassword: "",
      conpass: "",
      institution: "",
    });
    document.getElementById("professionError").innerHTML = ""; // Clear any previous error messages
    document.getElementById("passnomatch").innerHTML = "";
    document.getElementById("emailError").innerHTML = "";
    document.getElementById("closebutton").click(); // Programmatically click the close button
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
                <li key={index} className="nav-item active">
                  <Link
                    activeClass="active"
                    spy={true}
                    smooth={true}
                    offset={90}
                    duration={3}
                    className="nav-link"
                    to={link.id}
                  >
                    {link.text}
                  </Link>{" "}
                </li>
              ))}
            </ul>
          </div>
          {showbtn ? (
            <button
              className="btn btn-primary"
              onClick={() => {
                handleDash();
              }}
            >
              Dash
            </button>
          ) : null}
          <div className="ml-auto">
            {/* Right-aligned items */}

            <div
              className=" btn-group dropdown-center"
              style={{ paddingRight: "30px", boxSizing: "border-box" }}
            >
              <button
                onClick={ShowModalOps}
                className="btn dropdown-toggle btn"
                id="dropdownMenuLink"
                // data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill={svgcolor}
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
                      onClick={link.fun}
                      className="dropdown-item"
                      data-bs-toggle="modal"
                      data-bs-target={link.target}
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
        id="SignupModal"
        tabIndex="-1"
        aria-labelledby="SignupLabel"
        aria-hidden="true"
        style={{ padding: "12px 15px" }}
        data-bs-backdrop="static"
      >
        <div className="modal-dialog">
          <div className="modal-content p-4">
            <div className="modal-header">
              <h5>Sign-up</h5>
              <button
                id="signupClose"
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleForm}>
              <div className="tab-content">
                <div className="tab-pane fade show active" id="signupTab">
                  <span id="passnomatch" className="text-danger"></span>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Enter your name:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      autoComplete="off"
                      required
                      value={user.name}
                      onChange={handleInput}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="signemail" className="form-label">
                      Enter your email:
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="signemail"
                      autoComplete="off"
                      required
                      value={user.signemail}
                      onChange={handleInput}
                    />
                    <span id="emailError" className="text-danger"></span>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="profession" className="form-label">
                      Who are you?
                    </label>
                    <select
                      className="form-select"
                      id="profession"
                      required
                      value={user.profession}
                      onChange={handleInput}
                    >
                      <option value="Default">Default</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Student">Student</option>
                      <option value="Others">Others</option>
                    </select>
                    <span id="professionError" className="text-danger"></span>
                  </div>

                  {user.profession === "Student" ||
                  user.profession === "Teacher" ? (
                    <div className="mb-3">
                      <label htmlFor="institution" className="form-label">
                        Institution:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="institution"
                        autoComplete="off"
                        required
                        value={user.institution}
                        onChange={handleInput}
                      />
                    </div>
                  ) : null}

                  <div className="mb-3">
                    <label htmlFor="signpassword" className="form-label">
                      Password
                    </label>
                    <input
                      type="signpassword"
                      className="form-control"
                      id="signpassword"
                      required
                      value={user.signpassword}
                      onChange={handleInput}
                    />
                    <span id="passwordError" className="text-danger"></span>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="conpass" className="form-label">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="conpass"
                      required
                      value={user.conpass}
                      onChange={handleInput}
                    />
                    <span id="conpassError" className="text-danger"></span>
                  </div>

                  <div className="modal-footer" id="foot">
                    <button
                      onClick={clearFields}
                      type="button"
                      className="btn btn-secondary"
                      id="closebutton"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      id="SignUpButton"
                      className="btn btn-primary"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Loginmodal />
      <div
        id="registrationtoast"
        className="toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        data-bs-autohide="false"
        style={{
          position: "fixed",
          top: "60px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 200000, // Set a higher z-index
        }}
      >
        <div className="toast-header">
          <img
            src={logo}
            className="rounded me-2"
            alt="..."
            width="30"
            height="30"
          />
          <strong className="me-auto">Trinetra</strong>
          <small>Thank you for registration</small>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div className="toast-body">
          Registration successful! Please login once again using your
          credentials! Happy Coding!!!
        </div>
      </div>

      <div
        className="modal fade"
        id="OTPmodal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={Otpcheck}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="otp">Enter Otp</label>
                  <input
                    id="otp"
                    type="text"
                    className="form-control"
                    required
                    value={OTP.otp}
                    onChange={settingotp}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  id="otpclose"
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
Navbar.propTypes = {
  navLinks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Navbar;
