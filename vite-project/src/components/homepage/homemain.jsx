import Navbar from "./navbar";
import Mainbanner from "./mainbanner";
import Aboutus from "./aboutus";
import CarouselCard from "./CarouselCard";
import Footer from "./footer";
import React from "react";
import CodeathonComp from "./CodeathonComp";

const homemain = () => {
  const token = localStorage.getItem("token");
  const navLinks = [
    { id: "AboutUs", text: "About Us", navfun: () => {} },
    { id: "Projects", text: "Projects", navfun: () => {} },
    { id: "Hackathons", text: "Hackathons", navfun: () => {} },
    { id: "popproj", text: "Popular Projects", navfun: () => {} },
  ];
  let modalops = [
    { label: "Sign Up", target: "#SignupModal", fun: () => {} },
    { label: "Login", target: "#loginModal", fun: () => {} }, // Default empty function
    { label: "Join Us", target: "#", fun: () => {} }, // Default empty function
  ];

  if (token) {
    modalops = [
      { label: "Sign Up", fun: () => {} },
      { label: "Login", fun: () => {} }, // Default empty function
      { label: "Join Us", fun: () => {} }, // Default empty function
    ];
  }

  return (
    <>
      <Navbar navLinks={navLinks} modalOps={modalops} svgcolor={"blue"} />
      <Mainbanner />
      <br />
      <br />
      <Aboutus />
      <br />
      <br />
      <CarouselCard />
      <br />

      <CodeathonComp />
      <br />
      <Footer />
    </>
  );
};

export default homemain;
