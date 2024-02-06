import React, { useState, useEffect } from "react";

const Projects = ({ email }) => {
  const [Pro, setPro] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [reportLink, setreportLink] = useState("");
  const reportLinkGenerator = async (fileName) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/reportLinkGenerator?fileName=${fileName}`
      );
      const response = await res.json();
      console.log(response);
      setreportLink(response.url);
    } catch (error) {
      console.log(error);
    }
  };

  const [likedProjects, setlikedProjects] = useState([]);
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
      console.log(result);
    } catch (error) {
      console.log(savedPro);

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
          <ul>
            {Pro.map((pro, ind) => (
              <li className="Plist" key={ind}>
                <h2>{pro.Title}</h2>
                <small>
                  <a
                    data-bs-toggle="modal"
                    data-bs-target={`#ProjectModal-${ind}`}
                    onClick={() => reportLinkGenerator(pro.File)}
                  >
                    see more
                  </a>
                </small>
                {email != pro.Email ? (
                  <div className="ml-auto">
                    <a
                      target="_blank"
                      onClick={() => {
                        SavePro(pro);
                      }}
                    >
                      {Favorites.some((fav) => fav.id === pro._id) ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="black"
                          class="bi bi-bookmark-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-bookmark"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                        </svg>
                      )}
                    </a>

                    <a onClick={() => handleLikeClick(pro.id)}>
                      {likedProjects.some(
                        (likedProj) => likedProj.id === pro.id
                      ) ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="yellow"
                          className="bi bi-star-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-star"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
                        </svg>
                      )}
                    </a>
                  </div>
                ) : null}

                <div
                  className="modal fade"
                  id={`ProjectModal-${ind}`}
                  data-bs-backdrop="static"
                  data-bs-keyboard="false"
                  tabindex="-1"
                  aria-labelledby="staticBackdropLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">
                          {pro.Title}
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => {
                            setreportLink(" ");
                          }}
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div className="mb-3">
                          <div className="Procont">
                            <p>
                              Technologies used:
                              {pro.Technology}
                            </p>

                            <p>About Project:{pro.Description}</p>
                            <div>
                              <h5>UploadedBy:</h5>
                              {pro.Email}
                            </div>

                            <a href={reportLink} target="blank">
                              View Project Report
                            </a>
                            <br />

                            <a href={pro.tget} target="blank">
                              get me to Code
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer"></div>
                    </div>
                  </div>
                </div>
              </li>
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
