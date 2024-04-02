import React, { useState, useEffect } from "react";

const ManageAlerts = () => {
  const [alertList, setAlertList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAlerts = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/GetAlerts");
      if (response.ok) {
        const data = await response.json();
        modifyList(data);
      } else {
        console.log("Failed to fetch alerts");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const modifyList = (data) => {
    const modifiedList = data.map((item) => ({
      name: item.Title,
      description: item.About,
      link: item.Link,
      _id: item._id,
    }));
    setAlertList(modifiedList);
  };

  useEffect(() => {
    getAlerts();
  }, []);

  const deleteAlert = async (id) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this alert?"
    );
    if (!confirmation) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/DeleteAlert/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Refresh the list of alerts after successful deletion
        getAlerts();
      } else {
        console.log("Failed to delete alert");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="DashContent">
      <div className="Projfol">
        <h1>Alerts</h1>
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
          {loading && <p>Loading...</p>}
          {!loading && alertList.length === 0 && <p>No alerts found.</p>}
          {!loading && alertList.length > 0 && (
            <ul>
              {alertList.map((alert, index) => (
                <li className="list-unstyled">
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
                                  <h6 className="mb-0">{alert.name}</h6>
                                  <span>{alert.description}</span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-5">
                              <div className="projectFooter">
                                <button
                                  className="btn btn-danger"
                                  onClick={() => deleteAlert(alert._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p>This content should appear at the bottom after you scroll.</p>
        </div>
      </div>
    </div>
  );
};

export default ManageAlerts;
