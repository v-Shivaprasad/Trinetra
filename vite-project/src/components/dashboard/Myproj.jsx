import React, { useState, useEffect } from "react";
import "./Content.css";
const Myproj = ({ email }) => {

  const [showLoader, setShowLoader] = useState(false);
  const showLoaderOverlay = showLoader ? (
    <div className="loader-overlay" id="loaderbg">
      <div
        className="loader"
        id="loader"
        style={{
          position: "fixed",
          top: "40%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 200000, // Set a higher z-index
        }}
      ></div>
    </div>
  ) : null;
  const [uploaded, setuploaded] = useState(false);
  const [updated, setupdated] = useState(false);
  const reportLinkGenerator = async (fileName) => {
    console.log(fileName);
    try {
      const res = await fetch(
        `http://localhost:3001/api/reportLinkGenerator?fileName=${fileName}`
      );
      const response = await res.json();
      console.log(response);
      const generatedReportLink = response.url;
      return generatedReportLink;
    } catch (error) {
      console.log(error);
    }
  };

  if (email === null) {
    return <p>Loadingggg</p>;
  }
  // const Email = { email };
  // console.log(Email);
  const [clgName, setclgName] = useState("");

  const InstName = async () => {
    try {
      const profile = await fetch(
        `http://localhost:3001/api/FindProfile?email=${email}`
      );
      const details = await profile.json();
      console.table(details);
      const Inst = await details.Profile.institution;
      setclgName(Inst);
      console.log(clgName);
    } catch (error) {
      console.error(error);
    }
  };

  const [Prolist, setProlist] = useState([]);
  const [FavPro, setFavPro] = useState([]);

  const getFav = async () => {
    const result = await fetch(
      `http://localhost:3001/api/GetFav?email=${email}`
    );
    if (result.ok) {
      const respo = await result.json();
      console.table(respo);
      return respo;
    } else {
      const err = await result;
      console.error(err);
    }
  };

  const [UpdatedProject, setUpdatedProject] = useState({
    ProjectName: "",
    Tech: "",
    Description: "",
    Link: "",
  });
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateTech, setUpdateTech] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [updateLink, setUpdateLink] = useState("");

  const handleUpdate = async (id) => {
    console.log(id);
    setShowLoader(true);
    // Create an object to store the updated fields
    const updatedFields = {};

    // Check and update each field individually
    if (updateTitle !== "") {
      updatedFields.ProjectName = updateTitle;
    }

    if (updateTech !== "") {
      updatedFields.Tech = updateTech;
    }

    if (updateDescription !== "") {
      updatedFields.Description = updateDescription;
    }

    if (updateLink !== "") {
      updatedFields.Link = updateLink;
    }

    // Update the state with the non-null and changed fields
    setUpdatedProject((prevUpdatedProject) => ({
      ...prevUpdatedProject,
      ...updatedFields,
    }));

    console.log(updatedFields);
    if (Object.keys(updatedFields).length === 0) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3001/api/UpdateProjectfields",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, updatedFields }),
        }
      );
      console.log(response);
      if (response.ok) {
        document.getElementById("UpdateModalClose").click();
        setupdated(true);
        setShowLoader(false);
      } else {
        console.error("Error updating project fields:", response.status);
        setShowLoader(false);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
    setShowLoader(false);
  };
  const [proj, setProj] = useState({
    Name: "",
    Tech: "",
    Description: "",
    Link: "",
    Email: email,
    InstitutionName: clgName,
  });
  const [File, setFile] = useState(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    setProj((prevProj) => ({
      ...prevProj,
      [id]: value,
      InstitutionName: clgName,
    }));
  };

  //Unsaving Project
  const [unsaved, setunsaved] = useState(false);
  const UnsaveProject = async (id) => {
    try {
      console.log(id);
      const response = await fetch("http://localhost:3001/api/removeSavedPro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, email }),
      });

      if (response.ok) {
        console.log("deleted");
        setunsaved(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("Name", proj.Name);
      formData.append("Tech", proj.Tech);
      formData.append("Description", proj.Description);
      formData.append("Link", proj.Link);
      formData.append("Email", proj.Email);
      formData.append("InstitutionName", proj.InstitutionName);
      formData.append("File", File);

      const ProjectResp = await fetch(
        "http://localhost:3001/api/uploadProjects",
        {
          method: "POST",
          body: formData,
        }
      );

      if (ProjectResp.ok) {
        setProj({
          Name: "",
          Tech: "",
          Description: "",
          Link: "",
          InstitutionName: clgName,
          Email: email,
        });
        setuploaded(true);
        alert("Project uploaded successfully");
      } else {
        const errorResponse = await ProjectResp.json();
        if (errorResponse.error === "Project with this Link already exists") {
          window.alert(
            "Project with this Link already exists. Please choose a different Link."
          );
        } else if (errorResponse.error === "Choose a different Project name") {
          alert(errorResponse.error);
        } else {
          console.error(errorResponse.error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const FetchUploadedProjects = async () => {
    try {
      const proRes = await fetch(
        `http://localhost:3001/api/UploadedProjects?email=${email}`
      );
      const resp = await proRes.json();
      console.table(resp);
      return resp;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const projects = await FetchUploadedProjects();
      console.table(projects);
      const modifiedList = projects.map((project) => ({
        Title: project.ProjectName,
        tget: project.Link,
        Description: project.Description,
        tech: project.Technology,
        Email: project.Email,
        File: project.File.fileName,
        id: project._id,
      }));
      console.log(modifiedList);
      setProlist(modifiedList);
      const Favproj = await getFav();
      console.log(Favproj);
      const modifiedFavList = Favproj.favoriteProjects.map((project) => ({
        Title: project._id.ProjectName,
        tget: project._id.Link,
        Description: project._id.Description,
        tech: project._id.Technology,
        UploadedBy: project._id.Email,
        File: project._id.File.fileName,
        id: project._id._id,
      }));
      // console.log(modifiedFavList);
      setFavPro(modifiedFavList);
      // console.table(FavPro);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (email) {
      fetchData();
      InstName();
    }
  }, [email]);

  useEffect(() => {
    if (uploaded || updated || unsaved) {
      fetchData();
      setupdated(false);
      setuploaded(false);
      setunsaved(false);
    }
  }, [updated, uploaded, unsaved]);

  return (
    <>
      <div className="DashContent">
        <div className="Projfol">
          <nav>
            <div className="nav nav-tabs mb-3" id="nav-tab" role="tablist">
              <button
                className="nav-link active"
                id="nav-home-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-home"
                type="button"
                role="tab"
                aria-controls="nav-home"
                aria-selected="true"
              >
                Uploaded
              </button>
              <button
                className="nav-link"
                id="nav-profile-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-profile"
                type="button"
                role="tab"
                aria-controls="nav-profile"
                aria-selected="false"
              >
                Saved
              </button>

              <button
                className="nav-link mx-auto"
                id="nav-upload-tab"
                data-bs-toggle="tab"
                data-bs-target="#upload-tab"
                type="button"
                role="tab"
                aria-controls="upload-tab"
                aria-selected="false"
              >
                Upload
              </button>
            </div>
          </nav>
          {showLoaderOverlay}
          <div className="tab-content" id="nav-tabContent">
            <div
              className="tab-pane fade show active"
              id="nav-home"
              role="tabpanel"
              aria-labelledby="nav-home-tab"
            >
              <p>
                <strong>Uploaded projs</strong>
              </p>
              <div>
                <div>
                  <div>
                    <h5
                      className="modal-title"
                      id="exampleModalScrollableTitle"
                    ></h5>
                  </div>
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

                    <ul className="card-container list-unstyled">
                      {Prolist.map((project, index) => (
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
                                          <h6 className="mb-0">
                                            {project.Title}
                                          </h6>{" "}
                                          <span>{project.Email}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="mt-5">
                                      <h3 className="heading">
                                        {project.Description}
                                      </h3>
                                      <br />
                                      <h5>Technologies Used:</h5> {project.tech}
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
                                          <a
                                            href={project.tget}
                                            target="_blank"
                                          >
                                            Get code
                                          </a>
                                          &nbsp; &nbsp;
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
                                          &nbsp;&nbsp;
                                          <a
                                            data-bs-toggle="modal"
                                            data-bs-target={`#UpdateProjects-${index}`}
                                          >
                                            Update
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div
                                  className="modal fade"
                                  id={`UpdateProjects-${index}`}
                                  data-bs-backdrop="static"
                                  data-bs-keyboard="false"
                                  tabIndex="-1"
                                  aria-labelledby="staticBackdropLabel"
                                  aria-hidden="true"
                                >
                                  <div className="modal-dialog">
                                    <div className="modal-content">
                                      <div className="modal-header">
                                        <h5
                                          className="modal-title"
                                          id="staticBackdropLabel"
                                        >
                                          Update Project: {project.Title}
                                        </h5>
                                        <button
                                          type="button"
                                          className="btn-close"
                                          data-bs-dismiss="modal"
                                          aria-label="Close"
                                        ></button>
                                      </div>
                                      <div className="modal-body">
                                        <div className="mb-3">
                                          <div className="Procont">
                                            <label htmlFor="updateTitle">
                                              Project Title:
                                            </label>
                                            <input
                                              id="updateTitle"
                                              type="text"
                                              className="form-control"
                                              defaultValue={project.Title}
                                              onChange={(e) =>
                                                setUpdateTitle(e.target.value)
                                              }
                                            />

                                            <label htmlFor="updateTech">
                                              Technologies used:
                                            </label>
                                            <input
                                              id="updateTech"
                                              type="text"
                                              className="form-control"
                                              defaultValue={project.tech}
                                              onChange={(e) =>
                                                setUpdateTech(e.target.value)
                                              }
                                            />

                                            <label htmlFor="updateDescription">
                                              About Project:
                                            </label>
                                            <textarea
                                              id="updateDescription"
                                              type="text"
                                              className="form-control"
                                              defaultValue={project.Description}
                                              onChange={(e) =>
                                                setUpdateDescription(
                                                  e.target.value
                                                )
                                              }
                                            />

                                            <label htmlFor="UpdateLink">
                                              Update Link:
                                            </label>
                                            <input
                                              type="text"
                                              id="UpdateLink"
                                              className="form-control"
                                              defaultValue={project.tget}
                                              onChange={(e) =>
                                                setUpdateLink(e.target.value)
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="modal-footer">
                                        <button
                                          id="UpdateModalClose"
                                          type="button"
                                          className="btn btn-secondary"
                                          data-bs-dismiss="modal"
                                        >
                                          Close
                                        </button>
                                        <button
                                          type="button"
                                          className="btn btn-primary"
                                          onClick={() =>
                                            handleUpdate(project.id)
                                          }
                                        >
                                          Save changes
                                        </button>
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
                    <p>
                      This content should appear at the bottom after you scroll.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="nav-profile"
              role="tabpanel"
              aria-labelledby="nav-profile-tab"
            >
              <div
                className="tab-pane fade show active"
                id="nav-home"
                role="tabpanel"
                aria-labelledby="nav-home-tab"
              >
                <p>
                  <strong>Saved</strong>
                </p>
                <div>
                  <div>
                    <div>
                      <h5
                        className="modal-title"
                        id="exampleModalScrollableTitle"
                      ></h5>
                    </div>
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
                      <div>
                        <p>Projects</p>
                        <ul className="list-unstyled">
                          {FavPro.map((project, index) => (
                            <div className="ParentBox" key={index}>
                              <div className="container mt-5 mb-3">
                                <div className="row">
                                  <li>
                                    <div className="col-md-4">
                                      <div className="card p-3 mb-2">
                                        <div className="d-flex justify-content-between">
                                          <div className="d-flex flex-row align-items-center">
                                            <div className="icon">
                                              <i className="bx bxl-mailchimp"></i>
                                            </div>
                                            <div className="ms-2 c-details">
                                              <h6 className="mb-0">
                                                {project.Title}
                                              </h6>
                                              <span>{project.UploadedBy}</span>
                                            </div>
                                          </div>
                                          <div className="badge">
                                            <span>Design</span>
                                          </div>
                                        </div>
                                        <div className="mt-5">
                                          <h3 className="heading">
                                            {project.Description}
                                          </h3>
                                          <br />
                                          <h5>Technologies Used:</h5>{" "}
                                          {project.tech}
                                          <div className="mt-5">
                                            <div className="progress">
                                              <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{ width: "50%" }}
                                                aria-valuenow={70}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                              ></div>
                                            </div>
                                            <div className="mt-3">
                                              <a
                                                href={project.tget}
                                                target="_blank"
                                              >
                                                Get code
                                              </a>
                                              &nbsp; &nbsp;
                                              <a
                                                onClick={async () => {
                                                  console.log(project.File);
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
                                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                              <a
                                                onClick={() => {
                                                  UnsaveProject(project.id);
                                                }}
                                              >
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="16"
                                                  height="16"
                                                  fill="currentColor"
                                                  class="bi bi-trash3"
                                                  viewBox="0 0 16 16"
                                                >
                                                  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                                </svg>
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
                      </div>

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
                      <p>
                        This content should appear at the bottom after you
                        scroll.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="tab-pane fade"
              id="upload-tab"
              role="tabpanel"
              aria-labelledby="nav-upload-tab"
            >
              <div className="proForm">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="Name" className="form-label">
                      Enter Title:
                    </label>{" "}
                    <input
                      id="Name"
                      type="text"
                      className="form-control"
                      required
                      value={proj.Name}
                      onChange={handleChange}
                    />{" "}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="Tech" className="form-label">
                      Mention the technologies used:
                    </label>{" "}
                    <input
                      id="Tech"
                      type="text"
                      className="form-control"
                      required
                      value={proj.Tech}
                      onChange={handleChange}
                    />{" "}
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="CName"
                      className="form-label "
                      style={{ color: "gray" }}
                    >
                      Institution Name:
                    </label>{" "}
                    <input
                      id="CName"
                      type="text"
                      className="form-control "
                      value={clgName}
                      disabled
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="email"
                      className="form-label "
                      style={{ color: "gray" }}
                    >
                      Email
                    </label>{" "}
                    <input
                      id="email"
                      type="text"
                      className="form-control "
                      defaultValue={email}
                      disabled
                    />{" "}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="Description" className="form-label">
                      Description:
                    </label>{" "}
                    <p
                      className="font-weight-lighter"
                      style={{ color: "gray" }}
                    >
                      Enter only up to 100 words
                    </p>
                    <textarea
                      id="Description"
                      type="text"
                      required
                      className="form-control"
                      value={proj.Description}
                      onChange={handleChange}
                    />{" "}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="Link" className="form-label">
                      Add the GitHub link
                    </label>{" "}
                    <input
                      id="Link"
                      type="url"
                      className="form-control"
                      required
                      value={proj.Link}
                      onChange={handleChange}
                    />{" "}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="File" className="form-label">
                      Upload Project Report:
                    </label>
                    <input
                      type="file"
                      name="pdf"
                      className="form-control"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-primary" type="submit">
                      Upload
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Myproj;
