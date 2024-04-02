import React, { useState, useEffect } from "react";

const Projects = ({ email }) => {
  const [Pro, setPro] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const fetchData = async () => {
    try {
      const respo = await fetch("http://localhost:3001/api/FindAllProjects");
      const res = await respo.json();
      const modLi = res.map((proj) => ({
        Title: proj.ProjectName,
        tget: proj.Link,
        Description: proj.Description,
        Technology: proj.Technology,
        Email: proj.Email,
        Institution: proj.InstitutionName,
        File: proj.File.fileName,
        _id: proj._id,
        Likes: proj.Likes,
      }));
      setPro(modLi);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const respo = await fetch("http://localhost:3001/api/FindAllProjects");
        const res = await respo.json();
        const modLi = res
          .filter((p) =>
            p.Technology.toLowerCase().includes(searchInput.toLowerCase())
          )
          .map((p) => ({
            Title: p.ProjectName,
            tget: p.Link,
            Description: p.Description,
            Technology: p.Technology,
            Email: p.Email,
            ClgName: p.InstitutionName,
            File: p.File.fileName,
            _id: p._id,
            Likes: p.Likes,
          }));
        setPro(modLi);
      } catch (error) {
        console.error(error);
      }
    };

    const debounceTimeout = setTimeout(fetchData, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchInput]);

  const handleSearch = (e) => {
    const input = e.target.value;
    setSearchInput(input);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      fetchData();
    }
  };

  const reportLinkGenerator = async (fileName) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/reportLinkGenerator?fileName=${fileName}`
      );
      const response = await res.json();
      const generatedReportLink = response.url;
      return generatedReportLink;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="DashContent">
      <div className="Projfol">
        <h1>Projects</h1>
        <input
          type="text"
          className="srchbox"
          value={searchInput}
          onChange={handleSearch}
          onKeyDown={handleEnter}
        ></input>
        <br />

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
          <p>Projects</p>
          <ul className="list-unstyled">
            {Pro.map((project, index) => (
              <div className="ParentBox" key={index}>
                <div className="container mt-5 mb-3">
                  <div className="row">
                    <li>
                      <div className="col-md-4">
                        <div className="card p-3 mb-2">
                          <div className="d-flex justify-content-between">
                            <div className="d-flex flex-row align-items-center">
                              <div className="icon">
                                {" "}
                                <i className="bx bxl-mailchimp"></i>{" "}
                              </div>
                              <div className="ms-2 c-details">
                                <h6 className="mb-0">{project.Title}</h6>{" "}
                                <span>{project.Email}</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-5">
                            <h3 className="heading">{project.Description}</h3>
                            <br />
                            <h5>Technologies Used:</h5> {project.Technology}
                            <div className="mt-5">
                              <div className="projectFooter">
                                {" "}
                                <div className="1child">
                                  <span style={{ color: "black" }}>
                                    Likes : {project.Likes}&nbsp;
                                  </span>
                                </div>
                                <div className="2child">
                                  <span>
                                    {" "}
                                    <a href={project.tget} target="_blank">
                                      Get code
                                    </a>
                                  </span>
                                  &nbsp; &nbsp;
                                  <span>
                                    {" "}
                                    <a
                                      onClick={async () => {
                                        const generatedReportLink =
                                          await reportLinkGenerator(
                                            project.File
                                          );
                                        window.open(
                                          generatedReportLink,
                                          "_blank"
                                        );
                                      }}
                                    >
                                      Project Report
                                    </a>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </div>
                </div>
              </div>
            ))}
          </ul>

          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <p>This content should appear at the bottom after you scroll.</p>
        </div>
      </div>
    </div>
  );
};

export default Projects;
