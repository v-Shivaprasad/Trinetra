import React, { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";
const LIKE_ACTION = "like";
const UNLIKE_ACTION = "unlike";
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
    } else {
      const err = await result;
      console.error(err);
    }
  };
  const [likedProject, setLikedProjects] = useState([]);
  const [likevalue, setLikevalue] = useState(false);
  const getLiked = async () => {
    const result = await fetch(
      `http://localhost:3001/api/FindLikedProjects?email=${email}`
    );
    const res = await result.json();
    console.table(res);
    const modified = await res.Liked.map((project) => ({
      _id: project._id,
    }));
    setLikedProjects(modified);
    console.log("Modified:", modified);
    console.table(likedProject);
  };
  const handleLikeClick = async (project, action) => {
    try {
      const likedPro = {
        email: email,
        project: {
          _id: project._id,
        },
        action: action,
      };
      const request = await fetch("http://localhost:3001/api/like-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(likedPro),
      });
      setLikevalue(true);
      const result = await request.json();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };
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
  const fetchData = async () => {
    try {
      const proj = await Projs();
      console.log(proj);
      const modLi = proj.map((proj) => ({
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
      console.table(modLi);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.table(Favorites);
  }, [Favorites]);

  useEffect(() => {
    if (likevalue) {
      getLiked();
      fetchData();
      setLikevalue(false);
    }
  }, [likevalue]);
  useEffect(() => {
    getFav();
    getLiked();
  }, []); // Empty dependency array ensures it runs only once after mount
  useEffect(() => {
    if (saved) {
      getFav();
      fetchData();
      setSaved(false);
    }
  }, [saved]);
  useEffect(() => {
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
            Likes: p.Likes,
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

  // const [languages, setLanguages] = useState([]);
  // useEffect(() => {
  //   const repoUrl =
  //     "https://api.github.com/repos/machadop1407/Musical-Chat-Frontend"; // Replace with your dynamic repo URL

  //   const fetchRepoLanguages = async () => {
  //     try {
  //       // Fetch repository information
  //       const response = await fetch(repoUrl);
  //       const data = await response.json();

  //       // Fetch languages information
  //       const languagesResponse = await fetch(data.languages_url);
  //       const languagesData = await languagesResponse.json();

  //       // Extract and set languages with percentage
  //       if (languagesData) {
  //         const totalSize = Object.values(languagesData).reduce(
  //           (acc, size) => acc + size,
  //           0
  //         );
  //         const languagesWithPercentage = Object.entries(languagesData).map(
  //           ([language, size]) => ({
  //             language,
  //             percentage: (size / totalSize) * 100,
  //           })
  //         );
  //         setLanguages(languagesWithPercentage);
  //         console.log(languages);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching repo languages:", error);
  //     }
  //   };

  //   fetchRepoLanguages();
  // }, []);

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
                              {/*   <div className="progress">
                               {languages.map((lang) => (
                                  <ProgressBar languages={lang} />
                                ))} 
                              </div>*/}

                              {/* <div className="mt-3"> */}
                              <div className="projectFooter">
                                {" "}
                                <div className="1child">
                                  <a
                                    onClick={() =>
                                      handleLikeClick(
                                        project,
                                        likedProject.some(
                                          (like) => like._id === project._id
                                        )
                                          ? UNLIKE_ACTION
                                          : LIKE_ACTION
                                      )
                                    }
                                  >
                                    {likedProject.some(
                                      (like) => like._id === project._id
                                    ) ? (
                                      <div>
                                        {" "}
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="25"
                                          height="25"
                                          fill="blue"
                                          class="bi bi-hand-thumbs-up-fill"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" />
                                        </svg>
                                      </div>
                                    ) : (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="25"
                                        height="25"
                                        fill="blue"
                                        class="bi bi-hand-thumbs-up"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
                                      </svg>
                                    )}
                                  </a>
                                  <span style={{ color: "black" }}>
                                    {project.Likes}
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
          <br />
          <br />
          <p>This content should appear at the bottom after you scroll.</p>
        </div>
      </div>
    </div>
  );
};

export default Projects;
