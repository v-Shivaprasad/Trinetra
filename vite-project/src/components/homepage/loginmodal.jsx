import React, { useState } from "react";
import { useAuth } from "../../store/Authmanage";
import { Navigate, useNavigate } from "react-router-dom";
const Loginmodal = () => {
  const { islogin, setislogin, setshowbtn, client, setClient } = useAuth();

  const navigate = useNavigate();
  const [login, setlogin] = useState({
    logemail: "",
    logpassword: "",
  });
  const validateCred = (e) => {
    let name = e.target.id;
    let value = e.target.value;
    setlogin((prevLogin) => ({
      ...prevLogin,
      [name]: value,
    }));
  };

  const resetForm = () => {
    document.getElementById("logpassword").innerHTML = "";
    document.getElementById("logemail").innerHTML = "";
  };

const loginPrint = async (e) => {
  e.preventDefault();
  document.getElementById("logclosebutton").click();
  console.table(login);

  try {
    const response = await fetch("http://localhost:3001/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(login),
      credentials: "include", // <-- crucial for HTTP-only cookies
    });
    const res = await response.json();
    console.log(res);
    if (!res.ok) {
      
      alert(res.error);
      throw new Error(res.error || "Login failed");
    }
    // No token in response; backend sets it in HTTP-only cookie
    setislogin(true);
    setshowbtn(true);

    // Optionally fetch user profile for state
    try {
      const profileResp = await fetch(
        `http://localhost:3001/api/users/me`,
        { credentials: "include" }
      );
      const profile = await profileResp.json();
      console.table(profile);
      setClient(profile); // store profile in global state if needed
    } catch (error) {
      console.error("Error fetching profile:", error);
    }

    navigate("/dash"); // go to dashboard
  } catch (error) {
    console.error("Error during login:", error.message);
  }
};

  return (
    <>
      <div
        className="modal fade"
        id="loginModal"
        tabIndex="-1"
        aria-labelledby="loginModalLabel"
        aria-hidden="true"
        style={{ padding: "12px 15px" }}
        data-bs-backdrop="static"
      >
        <div className="modal-dialog">
          <div className="modal-content p-4">
            {/* Replace modal-header in 2a with the one from 2b */}
            <div className="modal-header">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                fill="blue"
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
            </div>

            {/* Replace form in 2a with the one from 2b */}
            <form onSubmit={loginPrint}>
              <div className="tab-content">
                <div className="tab-pane fade show active" id="loginTab">
                  {/* Replace form fields in 2a with the ones from 2b */}
                  <span id="invalidcred" className="text-danger"></span>
                  <div className="mb-3">
                    <label htmlFor="logemail" className="form-label">
                      Enter your email:
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="logemail"
                      required
                      onChange={validateCred}
                      value={login.logemail}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="logpassword" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="logpassword"
                      required
                      onChange={validateCred}
                      value={login.logpassword}
                    />
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      onClick={resetForm}
                      data-bs-dismiss="modal"
                      className="btn btn-secondary"
                      id="logclosebutton"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      id="loginButton"
                      className="btn btn-primary"
                    >
                      LOGIN
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loginmodal;
