import React, { useEffect, useState } from 'react';
import './Carousel.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import img1 from "/Users/Dell/Desktop/Trinetra/vite-project/src/assets/images1.jpeg";
import img2 from "/Users/Dell/Desktop/Trinetra/vite-project/src/assets/images2saveprojects.png";
import img3 from "/Users/Dell/Desktop/Trinetra/vite-project/src/assets/research.png";
import img4 from "/Users/Dell/Desktop/Trinetra/vite-project/src/assets/savetime.png";
import img from "/Users/Dell/Desktop/Trinetra/vite-project/src/assets/img.png";

const CarouselCard = () => {
  const [isAutoPlay, setIsAutoPlay] = useState(true); // Initialize isAutoPlay state

  useEffect(() => {
    const wrapper = document.querySelector(".wrapper");
    const carousel = document.querySelector(".carousel");
    const firstCardWidth = carousel.querySelector(".card").offsetWidth;
    const arrowBtns = document.querySelectorAll(".wrapper i");
    const carouselChildrens = [...carousel.children];
    let isDragging = false,
      startX,
      startScrollLeft,
      timeoutId;

    // Get the number of cards that can fit in the carousel at once
    let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

    // Insert copies of the last few cards to the beginning of the carousel for infinite scrolling
    carouselChildrens
      .slice(-cardPerView)
      .reverse()
      .forEach((card) => {
        carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
      });

    // Insert copies of the first few cards to the end of carousel for infinite scrolling
    carouselChildrens.slice(0, cardPerView).forEach((card) => {
      carousel.insertAdjacentHTML("beforeend", card.outerHTML);
    });

    // Scroll the carousel at an appropriate position to hide the first few duplicate cards on Firefox
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.offsetWidth;
    carousel.classList.remove("no-transition");

    // Add event listeners for the arrow buttons to scroll the carousel left and right
    arrowBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        carousel.scrollLeft +=
          btn.id === "left" ? -firstCardWidth : firstCardWidth;
      });
    });

    const dragStart = (e) => {
      isDragging = true;
      carousel.classList.add("dragging");
      startX = e.pageX;
      startScrollLeft = carousel.scrollLeft;
    };

    const dragging = (e) => {
      if (!isDragging) return;
      carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
    };

    const dragStop = () => {
      isDragging = false;
      carousel.classList.remove("dragging");
    };

    const infiniteScroll = () => {
      if (carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth;
        carousel.classList.remove("no-transition");
      } else if (
        Math.ceil(carousel.scrollLeft) ===
        carousel.scrollWidth - carousel.offsetWidth
      ) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
      }
      clearTimeout(timeoutId);
      if (!wrapper.matches(":hover")) autoPlay();
    };

    const autoPlay = () => {
      if (window.innerWidth < 800 || !isAutoPlay) return;
      timeoutId = setTimeout(
        () => (carousel.scrollLeft += firstCardWidth),
        2500
      );
    };
    autoPlay();

    carousel.addEventListener("mousedown", dragStart);
    carousel.addEventListener("mousemove", dragging);
    document.addEventListener("mouseup", dragStop);
    carousel.addEventListener("scroll", infiniteScroll);
    wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
    wrapper.addEventListener("mouseleave", autoPlay);

    return () => {
      carousel.removeEventListener("mousedown", dragStart);
      carousel.removeEventListener("mousemove", dragging);
      document.removeEventListener("mouseup", dragStop);
      carousel.removeEventListener("scroll", infiniteScroll);
      wrapper.removeEventListener("mouseenter", () => clearTimeout(timeoutId));
      wrapper.removeEventListener("mouseleave", autoPlay);
    };
  }, [isAutoPlay]);

  return (
    <>
      <section
        className="card-slider-container"
        id="popproj"
        style={{
          padding: "0px 50px",
        }}
      >
        <div className="wrapper">
          <i id="left" src={faAngleLeft}></i>
          <ul className="carousel" style={{ paddingLeft: "10px" }}>
            <li className="card">
              <div className="img">
                <img src={img} alt="img" draggable="false" />
              </div>
              <h2>Search Projects acccross various domains!!</h2>
              {/* <span>Sales Manager</span> */}
            </li>
            {/* Add more card items as needed */}
            <li className="card">
              <div className="img">
                <img src={img1} alt="img" draggable="false" />
              </div>
              <h2>Stay Updated</h2>
              <span>
                Get real-time updates on Hackathons and codeathons nearby
              </span>
            </li>
            <li className="card">
              <div className="img">
                <img src={img2} alt="img" draggable="false" />
              </div>
              <h2>Research on the required domain</h2>
              <span></span>
            </li>
            <li className="card">
              <div className="img">
                <img src={img3} alt="img" draggable="false" />
              </div>
              <h2>Save the Project for later reference</h2>
              <span>You never lose it again</span>
            </li>
            {/* <li className="card">
              <div className="img">
                <img src={img} alt="img" draggable="false" />
              </div>
              <h2>Kristina Zasiadko</h2>
              <span>Bank Manager</span>
            </li> */}
            <li className="card">
              <div className="img">
                <img src={img4} alt="img" draggable="false" />
              </div>
              <h2>Enhance your skills</h2>
              <span>Inspire others</span>
            </li>
          </ul>
          <i id="right" className="fa-solid fa-angle-right"></i>
        </div>
      </section>
    </>
  );
};

export default CarouselCard;
