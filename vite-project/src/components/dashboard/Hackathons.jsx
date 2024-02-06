import React, { useEffect, useState } from "react";

const Alerts = () => {
  const [Alertlist, setAlertlist] = useState([]);

  const GetAlerts = async () => {
    try {
      const respon = await fetch("http://localhost:3001/api/GetAlerts");
      const data = await respon.json();
      console.log(data);
      Modifylist(data);
    } catch (error) {
      console.log(error);
    }
  };

  const Modifylist = (data) => {
    console.log(data);
    const modlist = data.map((data) => ({
      Name: data.Title,
      Description: data.About,
      tget: data.Link,
    }));
    setAlertlist(modlist);
    console.log(modlist);
    // setAlertlist((prevAlertList) => [
    //   ...prevAlertList,
    //   {
    //     Name: data.Title,
    //     Description: data.About,
    //     tget: data.Link,
    //   },
    // ]);
  };

  useEffect(() => {
    // Fetch alerts when the component mounts
    GetAlerts();
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
            maxHeight: "480px",
            overflowY: "auto",
            padding: "8px 8px",
          }}
        >
          <p>Alerts</p>
          <ul>
            {Alertlist.map((Alert, ind) => (
              <li className="Plist" key={ind}>
                <h2>{Alert.Name}</h2>
                <small>
                  <a
                    data-bs-toggle="modal"
                    data-bs-target={`#ProjModal-${ind}`}
                    target="blank"
                  >
                    see more
                  </a>
                </small>
                <div
                  className="modal fade"
                  id={`ProjModal-${ind}`}
                  data-bs-backdrop="static"
                  data-bs-keyboard="false"
                  tabIndex="-1"
                  aria-labelledby="staticBackdropLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">
                          {Alert.Name}
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
                            <p>{Alert.Name}</p>

                            <p>Details:{Alert.Description}</p>

                            <a href={Alert.tget} target="blank">
                              See more
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

export default Alerts;
