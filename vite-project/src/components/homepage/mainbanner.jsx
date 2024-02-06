import React, { useState, useEffect, useRef } from "react";
import vid from "/Users/Dell/Desktop/Trinetra/vite-project/src/assets/course-video.mp4";
import "/Users/Dell/Desktop/Trinetra/vite-project/src/components/homepage/banner.css";
import { Navigate, useNavigate } from "react-router-dom";

const Mainbanner = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const modalInstanceRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (searchTerm.trim() !== "") {
        setShowModal(true);
      }
    }
  };

  useEffect(() => {
    const modalElement = document.getElementById(
      "exampleModalCenteredScrollable"
    );

    const createModalInstance = () => {
      if (!modalInstanceRef.current && modalElement) {
        modalInstanceRef.current = new window.bootstrap.Modal(modalElement, {
          backdrop: "static",
        });
      }
    };

    if (showModal) {
      createModalInstance();

      if (modalInstanceRef.current) {
        modalInstanceRef.current.show();
      }
    } else if (modalInstanceRef.current) {
      modalInstanceRef.current.hide();
    }
  }, [showModal]);

  return (
    <>
      <section>
        <section
          className="section main-banner"
          id="top"
          data-section="section1"
        >
          <video autoPlay muted loop id="bg-video">
            <source src={vid} type="video/mp4" />
          </video>
          <div className="rtext">
            <div className="video-overlay header-text">
              <h2>Trinetra</h2>
              <p>
                <span className="ctext">Inspire Innovate Integrate</span> <br />
                Elevating Student Projects Across Universities!
              </p>
              <br />
              <br />
              <br />
              <div>
                <input
                  id="searchproj"
                  type="text"
                  placeholder="Browse projects!"
                  className="searchBox"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                ></input>
              </div>
            </div>
          </div>

          {showModal && (
            <div
              className="modal fade"
              id="exampleModalCenteredScrollable"
              tabIndex="-1"
              aria-labelledby="exampleModalCenteredScrollableTitle"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5
                      className="modal-title"
                      id="exampleModalCenteredScrollableTitle"
                    >
                      Modal title
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p>
                      This is some placeholder content to show a vertically
                      centered modal. We've added some extra copy here to show
                      how vertically centering the modal works when combined
                      with scrollable modals. We also use some repeated line
                      breaks to quickly extend the height of the content,
                      thereby triggering the scrolling. When content becomes
                      longer than the predefined max-height of modal, content
                      will be cropped and scrollable within the modal.
                    </p>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      onClick={() => {
                        setShowModal(false);
                      }}
                    >
                      Close
                    </button>
                    <button type="button" className="btn btn-primary">
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </section>
    </>
  );
};

export default Mainbanner;
