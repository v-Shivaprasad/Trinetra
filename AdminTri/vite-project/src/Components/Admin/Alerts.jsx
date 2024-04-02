import React, { useState } from "react";
const Alerts = () => {
  const [Alert, setAlert] = useState({
    Name: " ",
    Description: " ",
    Link: " ",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setAlert((prevAlert) => ({
      ...prevAlert,
      [id]: value,
    }));
  };

  const AlertPrint = async (e) => {
    e.preventDefault();
    console.log(Alert);
    try {
      const AlertPost = await fetch("http://localhost:3001/api/setAlert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Alert),
      });
      console.log(AlertPost);
      if (AlertPost.ok) {
        window.alert("uploaded successfully!");
        setAlert({
          Name: " ",
          Description: " ",
          Link: " ",
        });
        console.log(AlertPost);
      } else {
        console.error(AlertPost.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="DashContent">
      <div className="Projfol">
        <h1>Alerts</h1>
        <div className="proForm">
          <form onSubmit={AlertPrint}>
            <div className="mb-3">
              <label htmlFor="Name" className="form-label">
                Enter Title:
              </label>{" "}
              <input
                id="Name"
                type="text"
                className="form-control"
                required
                value={Alert.Name}
                onChange={handleChange}
              />{" "}
            </div>

            <div className="mb-3">
              <label htmlFor="Description" className="form-label">
                Description:
              </label>{" "}
              <p className="font-weight-lighter" style={{ color: "gray" }}>
                Enter only up to 100 words
              </p>
              <textarea
                id="Description"
                type="text"
                required
                className="form-control"
                value={Alert.Description}
                onChange={handleChange}
              />{" "}
            </div>
            <div className="mb-3">
              <label htmlFor="Link" className="form-label">
                Add the reference link
              </label>{" "}
              <input
                id="Link"
                type="url"
                className="form-control"
                required
                value={Alert.Link}
                onChange={handleChange}
              />{" "}
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
  );
};

export default Alerts;
