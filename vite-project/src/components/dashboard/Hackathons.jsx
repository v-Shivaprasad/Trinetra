import React, { useEffect, useState } from "react";

const Alerts = () => {
  const [alertList, setAlertList] = useState([]);

  const getAlerts = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/GetAlerts");
      const data = await response.json();
      console.log(data);
      modifyList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const modifyList = (data) => {
    console.log(data);
    const modList = data.map((item) => ({
      name: item.Title,
      description: item.About,
      link: item.Link,
    }));
    setAlertList(modList);
    console.log(modList);
  };

  useEffect(() => {
    // Fetch alerts when the component mounts
    getAlerts();
  }, []);

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
          <p>Alerts</p>
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
                              <a href={alert.link} target="blank">
                                See more
                              </a>
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
          <p>This content should appear at the bottom after you scroll.</p>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
