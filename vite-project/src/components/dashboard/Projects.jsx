import React, { useState, useEffect } from "react";

const Projects = ({ email }) => {
  const [Pro, setPro] = useState([]);

  const [searchInput, setSearchInput] = useState("");
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
  const [saved, setSaved] = useState(false);

  const [Favorites, setFavorites] = useState([]);
  const getFav = async () => {
    const result = await fetch(
      `http://localhost:3001/api/GetFav?email=${email}`
    );
    if (result.ok) {
      const respo = await result.json();
      console.table(respo);
      const modifiedList = respo.favoriteProjects.map((project) => ({
        id: project._id._id,
      }));
      console.table(modifiedList);
      await setFavorites(modifiedList);
      console.table(Favorites);
      // return respo;
    } else {
      const err = await result;
      console.error(err);
    }
  };

  const handleLikeClick = () => {
    console.log("clicked");
  };

  useEffect(() => {
    console.table(Favorites);
  }, [Favorites]);

  useEffect(() => {
    getFav();
  }, []); // Empty dependency array ensures it runs only once after mount
  useEffect(() => {
    if (saved) {
      getFav();
      setSaved(false);
    }
  }, [saved]);
  const Projs = async () => {
    try {
      const respo = await fetch("http://localhost:3001/api/FindAllProjects");
      const res = await respo.json();
      console.table(res);
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const proj = await Projs();
        console.log(proj);
        const modLi = proj.map((proj) => ({
          Title: proj.ProjectName,
          tget: proj.Link,
          Description: proj.Description,
          Email: proj.Email,
          Institution: proj.InstitutionName,
          File: proj.File.fileName,
          _id: proj._id,
        }));
        setPro(modLi);
        console.table(modLi);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const proj = await Projs();
        const modLi = proj
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
          }));
        setPro(modLi);
      } catch (error) {
        console.error(error);
      }
    };

    // Adding a delay of 300ms before making the API request
    const debounceTimeout = setTimeout(fetchData, 300);

    // Cleanup function to clear the timeout on component unmount or input change
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

  const SavePro = async (project) => {
    try {
      const savedPro = {
        email: email,
        Pro: {
          _id: project._id,
        },
      };
      console.log(savedPro);

      const resp = await fetch("http://localhost:3001/api/savedPro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(savedPro),
      });

      console.log(savedPro);
      // Handle the response here (e.g., show a success message or handle errors)
      const result = await resp.json();
      if (resp.ok) {
        setSaved(true);
      }
      console.log(result);
    } catch (error) {
      console.error(error);
      // Handle errors here (e.g., show an error message to the user)
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
            maxHeight: "480px",
            overflowY: "auto",
            padding: "8px 8px",
          }}
        >
          <p>Projects</p>
          <ul className="list-unstyled">
            {Pro.map((project, index) => (
              <div className="ParentBox">
                <div className="container mt-5 mb-3">
                  {" "}
                  <div className="row">
                    <li key={index}>
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
                            <div className="badge">
                              <span>
                                {email !== project.Email ? (
                                  Favorites.some(
                                    (fav) => fav.id === project._id
                                  ) ? (
                                    <a>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        class="bi bi-bookmarks-fill"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L7 13.101l-4.223 2.815A.5.5 0 0 1 2 15.5z" />
                                        <path d="M4.268 1A2 2 0 0 1 6 0h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L13 13.768V2a1 1 0 0 0-1-1z" />
                                      </svg>{" "}
                                    </a>
                                  ) : (
                                    <a
                                      onClick={() => {
                                        SavePro(project);
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        class="bi bi-bookmarks"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L7 13.101l-4.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v10.566l3.723-2.482a.5.5 0 0 1 .554 0L11 14.566V4a1 1 0 0 0-1-1z" />
                                        <path d="M4.268 1H12a1 1 0 0 1 1 1v11.768l.223.148A.5.5 0 0 0 14 13.5V2a2 2 0 0 0-2-2H6a2 2 0 0 0-1.732 1" />
                                      </svg>{" "}
                                    </a>
                                  )
                                ) : null}
                              </span>
                            </div>
                          </div>
                          <div className="mt-5">
                            <h3 className="heading">{project.Description}</h3>
                            <br />
                            <h5>Technologies Used:</h5> {project.Technology}
                            <div className="mt-5">
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{ width: "50%" }}
                                  value={70}
                                  aria-valuenow={70}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                ></div>
                              </div>
                              <div className="mt-3">
                                {" "}
                                <a href={project.tget} target="_blank">
                                  Get code
                                </a>
                                &nbsp; &nbsp;
                                <a
                                  onClick={async () => {
                                    const generatedReportLink =
                                      await reportLinkGenerator(project.File);
                                    window.open(generatedReportLink, "_blank");
                                  }}
                                >
                                  Project Report
                                </a>
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
          <br />
          <br />
          <p>This content should appear at the bottom after you scroll.</p>
        </div>
      </div>
    </div>
  );
};

export default Projects;
