import React from "react";
import vid from "/Users/Dell/Desktop/Trinetra/vite-project/src/assets/course-video.mp4";
import "/Users/Dell/Desktop/Trinetra/vite-project/src/components/homepage/banner.css";

const Mainbanner = () => {
  return (
    <section>
      <section className="section main-banner" id="top" data-section="section1">
        <video autoPlay muted loop id="bg-video">
          <source src={vid} type="video/mp4" />
        </video>

        <div className="video-overlay">
          <div className="rtext">
            <h2 style={{ color: "white" }}>Trinetra</h2>
            <p>
              <span className="ctext">Inspire Innovate Integrate</span> <br />
              <span style={{ color: "white" }}>
                Elevating Student Projects Across Universities!{" "}
              </span>
            </p>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Mainbanner;
