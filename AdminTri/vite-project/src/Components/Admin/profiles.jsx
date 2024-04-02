import React, { useState, useEffect } from "react";

const Profiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState(null);

  const fetchProfiles = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/FetchUsers");
      if (!response.ok) {
        throw new Error("Failed to fetch profiles");
      }
      const data = await response.json();
      setProfiles(data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    // Fetch profiles data from the server
    fetchProfiles();
  }, []);

  return (
    <div className="DashContent">
      <div className="Projfol">
        <h1>User Profiles</h1>
        <div
          className="modal-body"
          style={{
            border: "black",
            borderStyle: "solid",
            maxHeight: "95vh",
            overflowY: "auto",
            padding: "8px 8px",
          }}
        >
          {error ? (
            <p>Error: {error}</p>
          ) : (
            <ul className="list-unstyled">
              {profiles.map((profile, index) => (
                <div className="ParentBox" key={index}>
                  <div className="container mt-5 mb-3">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="card p-3 mb-2">
                          <div className="d-flex justify-content-between">
                            <div className="d-flex flex-row align-items-center">
                              <div className="icon">
                                <i className="bx bxl-mailchimp"></i>
                              </div>
                              <div className="ms-2 c-details">
                                <h6 className="mb-0">{profile.name}</h6>{" "}
                                <span>{profile.signemail}</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-5">
                            <p>Profession: {profile.profession}</p>
                            <p>Institution: {profile.institution}</p>
                            <p>
                              Last Logged In:{" "}
                              {profile.lastLoggedInDate
                                ? new Date(
                                    profile.lastLoggedInDate
                                  ).toLocaleString()
                                : "Never"}
                            </p>
                            <p>Projects Uploaded: {profile.ProjectsUploaded}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profiles;
