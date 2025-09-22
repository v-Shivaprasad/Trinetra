import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.jpg";
import Loginmodal from "./loginmodal";
import { Link } from "react-scroll";
import { useAuth } from "../../store/Authmanage";
import { useNavigate } from "react-router-dom";
import "../homepage/navbar.css";
import { Navbar as BootstrapNavbar, Nav, NavDropdown, Container, Button, Modal, Form } from 'react-bootstrap';

const Navbar = ({ navLinks, modalOps, svgcolor }) => {
  const { showbtn, logout } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    signemail: "",
    profession: "",
    signpassword: "",
    conpass: "",
    institution: "Default",
  });

  const [OTP, setOTP] = useState({ otp: "" });
  const [showLoader, setShowLoader] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);

  const handleDash = () => navigate("/dash");

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleInput = (e) => {
    const { id, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [id]: value,
      institution:
        id === "profession" && value !== "Student" && value !== "Teacher"
          ? "Default"
          : prev.institution,
    }));
  };

  const handleForm = async (e) => {
    e.preventDefault();
    setShowLoader(true);

    // Basic validations
    if (!user.profession) {
      alert("Profession required");
      setShowLoader(false);
      return;
    }
    if (user.signpassword !== user.conpass) {
      alert("Passwords do not match");
      setShowLoader(false);
      return;
    }

    try {
      // Check email uniqueness
      const emailCheckRes = await fetch(
        `http://localhost:3001/api/users/check-email?email=${user.signemail}`
      );
      const emailCheck = await emailCheckRes.json();
      if (!emailCheck.ok) {
        alert("Email already exists");
        setShowLoader(false);
        return;
      }

      // Initiate OTP
      const otpInitiate = await fetch(
        `http://localhost:3001/api/users/initiateReg?email=${user.signemail}`
      );
      if (!otpInitiate.ok) throw new Error("Failed OTP initiation");

      setShowSignupModal(false);
      setShowOTPModal(true);

    } catch (err) {
      console.log("Signup error:", err);
    } finally {
      setShowLoader(false);
    }
  };

  const Otpcheck = async (e) => {
    e.preventDefault();
    setShowLoader(true);
    try {
      const otpRes = await fetch("http://localhost:3001/api/users/validateOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: OTP.otp, email: user.signemail }),
      });
      const result = await otpRes.json();
      if (!result.ok) {
        alert("Invalid OTP");
        setShowLoader(false);
        return;
      }

      // Register user
      const signupRes = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      const signupData = await signupRes.json();
      if (!signupData.ok) {
        alert(signupData.error || "Signup failed");
        setShowLoader(false);
        return;
      }

      // setshowbtn(true); // Auto login
      setUser({ name: "", signemail: "", profession: "", signpassword: "", conpass: "", institution: "" });
      setOTP({ otp: "" });

      setShowOTPModal(false);

      navigate("/dash");
    } catch (err) {
      console.log(err);
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <>
      <BootstrapNavbar bg="light" expand="lg" fixed="top">
        <Container>
          <BootstrapNavbar.Brand href="#">
            <img src={logo} alt="Trinetra" width="30" height="30" className="d-inline-block align-top" />
            <span style={{ paddingLeft: "10px" }}>Trinetra</span>
          </BootstrapNavbar.Brand>

          <BootstrapNavbar.Toggle aria-controls="navbarNav" />
          <BootstrapNavbar.Collapse id="navbarNav">
            <Nav className="mx-auto">
              {navLinks.map((link, i) => (
                <Nav.Link key={i}>
                  <Link activeClass="active" spy smooth offset={90} duration={3} to={link.id}>
                    {link.text}
                  </Link>
                </Nav.Link>
              ))}
            </Nav>

            {showbtn && <Button variant="primary" onClick={handleDash}>Dash</Button>}

            <NavDropdown align="end" title={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill={svgcolor}
                className="bi bi-person-circle"
                viewBox="0 0 16 16"
              >
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                <path
                  fillRule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                />
              </svg>
            }>
              {modalOps.map((link, i) => (
                <NavDropdown.Item key={i} onClick={() => link.target ? setShowSignupModal(true) : null}>
                  {link.label}
                </NavDropdown.Item>
              ))}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>

      {/* Signup Modal */}
      <Modal show={showSignupModal} onHide={() => setShowSignupModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleForm}>
            <Form.Control type="text" id="name" placeholder="Name" value={user.name} onChange={handleInput} required />
            <Form.Control type="email" id="signemail" placeholder="Email" value={user.signemail} onChange={handleInput} required />
            <Form.Select id="profession" value={user.profession} onChange={handleInput} required>
              <option value="">Select</option>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Others">Others</option>
            </Form.Select>
            {(user.profession === "Student" || user.profession === "Teacher") && (
              <Form.Control type="text" id="institution" placeholder="Institution" value={user.institution} onChange={handleInput} required />
            )}
            <Form.Control type="password" id="signpassword" placeholder="Password" value={user.signpassword} onChange={handleInput} required />
            <Form.Control type="password" id="conpass" placeholder="Confirm Password" value={user.conpass} onChange={handleInput} required />
            <Button variant="primary" type="submit">Submit</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSignupModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* OTP Modal */}
      <Modal show={showOTPModal} onHide={() => setShowOTPModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={Otpcheck}>
            <Form.Control type="text" id="otp" value={OTP.otp} onChange={(e) => setOTP({ otp: e.target.value })} required />
            <Button variant="primary" type="submit">Submit</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOTPModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Loginmodal />
      {showLoader && <div className="loader-overlay"><div className="loader"></div></div>}
    </>
  );
};

export default Navbar;
