import React, { useState, useEffect } from "react";
import "./Content.css";
import logo from "../../assets/logo.jpg";
const Myproj = ({ email }) => {
  // const { client, setclient } = useAuth();
  // const email = client.Email;
  // console.log("projects reached ", email);

  const [reportLink, setreportLink] = useState("");

  const reportLinkGenerator = async (fileName) => {
    console.log(fileName);
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
    Title: "",
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
    // Create an object to store the updated fields
    const updatedFields = {};

    // Check and update each field individually
    if (updateTitle !== "") {
      updatedFields.Title = updateTitle;
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
      } else {
        console.error("Error updating project fields:", response.status);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
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
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.table(proj);
    try {
      const formData = new FormData();
      formData.append("Name", proj.Name);
      formData.append("Tech", proj.Tech);
      formData.append("Description", proj.Description);
      formData.append("Link", proj.Link);
      formData.append("Email", proj.Email);
      formData.append("InstitutionName", proj.InstitutionName);
      formData.append("File", File);
      console.log(formData);

      const ProjectResp = await fetch(
        "http://localhost:3001/api/uploadProjects",
        {
          method: "POST",
          body: formData,
        }
      );
      console.log(formData);

      if (ProjectResp.ok) {
        // const resp = await ProjectResp.json();
        setProj({
          Name: "",
          Tech: "",
          Description: "",
          Link: "",
          InstitutionName: clgName,
          Email: email,
        });

        // console.table(resp);
        FetchUploadedProjects();
      } else {
        const err = await ProjectResp;
        console.error(err);
      }
    } catch (d) {
      console.log(d);
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
  const updateLinkToNull = (e) => {
    setreportLink(" ");
    console.log(reportLink);
  };

  useEffect(() => {
    if (email) {
      fetchData();
      InstName();
    }
  }, [email]);

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
                    >
                      Modal title
                    </h5>
                  </div>
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
                                      <div className="badge">
                                        {" "}
                                        <span>Design</span>{" "}
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
                      >
                        Modal title
                      </h5>
                    </div>
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
                        {FavPro.map((pro, ind) => (
                          <li
                            className="Plist"
                            key={ind}
                            // title={pro.Description}
                          >
                            <h2>{pro.Title}</h2>
                            <small>
                              <a
                                data-bs-toggle="modal"
                                data-bs-target={`#ProModal-${ind}`}
                                onClick={() => {
                                  reportLinkGenerator(pro.File);
                                  console.log(pro.File);
                                }}
                              >
                                see more
                              </a>
                              <span className="mx-auto">
                                <a
                                  onClick={() => {
                                    UnsaveProject(pro.id);
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-trash3-fill"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                  </svg>
                                </a>
                              </span>
                            </small>
                            <div
                              className="modal fade"
                              id={`ProModal-${ind}`}
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
                                      {pro.Title}
                                    </h5>
                                    <button
                                      onClick={() => {
                                        updateLinkToNull();
                                      }}
                                      type="button"
                                      className="btn-close"
                                      data-bs-dismiss="modal"
                                      aria-label="Close"
                                    ></button>
                                  </div>
                                  <div className="modal-body">
                                    <div className="mb-3">
                                      <div className="Procont">
                                        <p>
                                          Technologies used:
                                          {pro.tech}
                                        </p>

                                        <p>About Project:{pro.Description}</p>
                                        <div>
                                          <h5>UploadedBy:</h5>
                                          {pro.UploadedBy}
                                        </div>

                                        <a href={pro.tget} target="blank">
                                          get me to Code
                                        </a>
                                        <br />
                                        <a href={reportLink} target="blank">
                                          View Project Report
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
