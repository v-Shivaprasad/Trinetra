import React, { useState } from "react";
const Adminmodal = () => {
  const [Admin, setAdmin] = useState({
    Admemail: "",
    Admpassword: "",
  });
  const [OTP, setOTP] = useState({
    otp: "",
  });
  // const navigate = useNavigate();
  const closemodAdm = () => {
    setAdmin({
      Admemail: "",
      Admpassword: "",
    });

    setOTP({
      otp: "",
    });

    document.getElementById("Admclosebutton").click();
  };

  const settingotp = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setOTP((prevOTP) => ({
      ...prevOTP,
      [id]: value,
    }));
  };
  const validateAdm = (e) => {
    e.preventDefault();
    let id = e.target.id;
    let value = e.target.value;

    setAdmin((prevAdmin) => ({
      ...prevAdmin,
      [id]: value,
    }));
  };

  const AdminPrint = async (e) => {
    e.preventDefault();
    console.table(Admin);

    try {
      const data = await fetch("http://localhost:3001/api/AdminT1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Admin),
      });
      const resp = await data.json();
      if (resp.ok) {
        document.getElementById("Admclosebutton").click();
        const Otpmodal = new bootstrap.Modal(
          document.getElementById("OTPmodal")
        );
        Otpmodal.show();
      } else {
        console.log("err");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const SubmitOtp = async (e) => {
    e.preventDefault();
    document.getElementById("otpclose").click();
    try {
      const ot = await fetch(
        `http://localhost:3001/api/AdminT2?OTP=${OTP.otp}`
      );
      const respo = await ot.json();
      console.log(respo);

      if (respo.ok) {
        localStorage.setItem("Atoken", respo.Atoken);
      } else {
        alert("OTP ERROR");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div
        className="modal fade"
        id="AdminModal"
        tabIndex="-1"
        aria-labelledby="loginModalLabel"
        aria-hidden="true"
        style={{ padding: "12px 15px" }}
        data-bs-backdrop="static"
      >
        <div className="modal-dialog">
          <div className="modal-content p-4">
            <div className="modal-header">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                fill="red"
                className="bi bi-person-circle"
                viewBox="0 0 16 16"
                style={{ paddingTop: "2px" }}
              >
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                <path
                  fillRule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 -1.37A7 7 0 0 0 8 1"
                />
              </svg>
            </div>

            <form onSubmit={AdminPrint}>
              <div className="tab-content">
                <div className="tab-pane fade show active" id="AdminTab">
                  <span id="invalidcred" className="text-danger"></span>
                  <div className="mb-3">
                    <label htmlFor="Admemail" className="form-label">
                      Enter your email:
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="Admemail"
                      required
                      onChange={validateAdm}
                      value={Admin.Admemail}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="Admpassword" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="Admpassword"
                      required
                      onChange={validateAdm}
                      value={Admin.Admpassword}
                    />
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      onClick={closemodAdm}
                      className="btn btn-secondary"
                      id="Admclosebutton"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      LOGIN
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
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
            <form onSubmit={SubmitOtp}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="OTP">Enter Otp</label>
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

export default Adminmodal;
