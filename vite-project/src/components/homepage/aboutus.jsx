import React from "react";
import apj from "/Users/Dell/Desktop/Trinetra/vite-project/src/assets/apj.jpg";
import arya from "/Users/Dell/Desktop/Trinetra/vite-project/src/assets/aryabhat.jpg";
import sr from "/Users/Dell/Desktop/Trinetra/vite-project/src/assets/ramanujam.jpg";
import logs from "/Users/Dell/Desktop/Trinetra/vite-project/src/assets/logo.jpg";

const Aboutus = () => {
  return (
    <div id="AboutUs" style={{ padding: "0px 32px" }}>
      <div>
        {/* Card 1 */}
        <div className="comcard-container">
          <div className="card-header">
            सा विद्या या विमुक्तये Sā vidyā yā vimuktaye
          </div>
          <div className="card1-body">
            <img src={apj} alt="APJ" />
            <img src={arya} alt="Aryabhat" />
            <img src={sr} alt="Ramanujam" />
            <img src={logs} alt="Logo" />
          </div>
          <blockquote className="card1-blockquote">
            <p>
              Many aspire, but few inspire. In the pursuit of dreams, be the
              beacon that sparks inspiration.
            </p>
          </blockquote>
        </div>

        {/* Card 2 */}
        <div className="comcard-container">
          <div className="card-header">
            <h3 className="text-white">ABOUT US!</h3>
          </div>
          <div className="card2-row">
            <div className="card2-img">
              <img src="assets/logo.jpg" alt="Logo" draggable="false" />
            </div>
            <div className="card2-content">
              <p>
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
                <span className="text-spl">
                  Your adventure awaits at Trinetra.
                </span>
              </p>
              <p>
                <small className="text-muted">Last updated 3 mins ago</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
