import React from "react";
import apj from "/Users/Dell/Desktop/Trinetra/vite-project/src/assets/apj.jpg";
import arya from "/Users/Dell/Desktop/Trinetra/vite-project/src/assets/aryabhat.jpg";
import sr from "/Users/Dell/Desktop/Trinetra/vite-project/src/assets/ramanujam.jpg";
import logs from "/Users/Dell/Desktop/Trinetra/vite-project/src/assets/logo.jpg";

const Aboutus = () => {
  return (
    <div style={{ scrollPaddingTop: "1050px" }} id="AboutUs">
      <div style={{ padding: "0px 32px" }}>
        <div className="card text-center">
          <div className="card-header primary">
            सा विद्या या विमुक्तये Sā vidyā yā vimuktaye
          </div>
          <div className="card-body">
            <img
              className="card-img-top"
              src={apj}
              style={{ height: 100, width: 100 }}
              alt="APJ"
            />
            <img
              className="card-img-top"
              src={arya}
              style={{ height: 100, width: 100 }}
              alt="Aryabhat"
            />
            <img
              className="card-img-top"
              src={sr}
              style={{ height: 100, width: 100 }}
              alt="Ramanujam"
            />
            <img
              className="card-img-top"
              src={logs}
              style={{ height: 100, width: 100 }}
              alt="Logo"
            />
            <blockquote className="blockquote mb-0">
              <p>
                Many aspire, but few inspire. In the pursuit of dreams, be the
                beacon that sparks inspiration.
              </p>
            </blockquote>
          </div>
        </div>
        <br />
        <br />
        <div className="card mb-3" id="Aboutus">
          <div className="row g-0">
            <div className="col-md-4">
              <img
                src="assets/logo.jpg"
                className="img-fluid rounded-start"
                alt="Logo"
                draggable="false"
              />
            </div>
            <div className="col-md-8">
              <div className="card-header">
                <h3>ABOUT US!</h3>
              </div>
              <br />
              <br />
              <br />
              <br />
              <div className="card-body">
                <p className="card-text">
                  About Trinetra - Ignite Your Brilliance! Embark on a
                  transformative journey with Trinetra, where innovation and
                  efficiency converge. Dive into a world of cutting-edge student
                  projects, fostering collaborative exploration and peer-driven
                  learning. Our commitment to clarity and user-centric design
                  promises an unparalleled online experience. Join a community
                  that values your time and intellect. Be part of something
                  extraordinary. Ready to revolutionize the way you learn and
                  connect? Login or join us now, and unlock a world where
                  brilliance knows no bounds.
                  <span
                    style={{
                      fontSize: "medium",
                      color: "chocolate",
                      fontFamily: "Arial, Helvetica, sans-serif",
                    }}
                  >
                    Your adventure awaits at Trinetra.
                  </span>
                </p>
                <p className="card-text">
                  <small className="text-muted">Last updated 3 mins ago</small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
