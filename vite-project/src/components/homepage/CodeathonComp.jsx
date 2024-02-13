import React from "react";

const CodeathonComp = () => {
  return (
    <section style={{ padding: "0px 32px" }}>
      <div className="isection">
        <h2>Explore the Benefits of Our Website</h2>
        <div className="benefits-container">
          <div className="benefit">
            <h3>Stay Informed</h3>
            <p>
              Get real-time updates on upcoming events, codeathons, and news in
              your academic community.
            </p>
          </div>
          <div className="benefit">
            <h3>Connect and Collaborate</h3>
            <p>
              Connect with fellow students, share ideas, and collaborate on
              exciting projects within a supportive community.
            </p>
          </div>
          <div className="benefit">
            <h3>Enhance Your Skills</h3>
            <p>
              Participate in codeathons and events to enhance your coding and
              problem-solving skills, preparing you for future challenges.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeathonComp;
