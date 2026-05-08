import { useEffect, useState } from "react";
import "./App.css";
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [deploying, setDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [originalMetadata, setOriginalMetadata] = useState([]);
  const [userData, setUserData] = useState({
      username: "",
      organization: "",
    });

  // -----------------------------
  // LOGIN SUCCESS
  // -----------------------------
  useEffect(() => {
    const params = new URLSearchParams( window.location.search );
    const success = params.get("success");
    if (success) { 
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setLoggedIn(true);
        setUserData({
          username:
            "assignment1998@test.com",
          organization: "test",
        });
      }, 2000);
    }
  }, []);

  // -----------------------------
  // LOGIN
  // -----------------------------
  const loginToSalesforce = () => { window.location.href = "http://localhost:5000/login";
  };

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const logout = () => {
    setLoggedIn(false);
    setMetadata(null);
    window.location.href = "/";
  };

  // -----------------------------
  // GET METADATA
  // -----------------------------
  const getMetadata = async () => {
    try {
      setMetadataLoading(true);
      const response = await fetch("http://localhost:5000/validation-rules");
      const data = await response.json();
      setTimeout(() => {
        setMetadata(data);
        setOriginalMetadata(data);
        setMetadataLoading(false);
      }, 2500);
    } catch (error) {
      console.log(error);
      setMetadataLoading(false);
    }
  };

  // -----------------------------
  // LOGIN LOADING
  // -----------------------------
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: "#f5f5f5",
          fontFamily: "Arial"
        }}
      >
      <div
        style={{
          width: "90px",
          height: "90px",
          border: "10px solid #eee",
          borderTop: "10px solid orange",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}
        >
        </div>
        <h2
          style={{
            marginTop: "20px",
            color: "orange"
          }}
        >
          Accessing Salesforce...
        </h2>

      </div>

    );

  }

  // -----------------------------
  // METADATA LOADING
  // -----------------------------
  if (metadataLoading) {

    return (

      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: "#f5f5f5",
          fontFamily: "Arial"
        }}
      >

        <div
          style={{
            width: "90px",
            height: "90px",
            border:
              "10px solid #eee",

            borderTop:
              "10px solid orange",

            borderRadius: "50%",

            animation:
              "spin 1s linear infinite"
          }}
        ></div>

        <h1
          style={{
            color: "orange",
            marginTop: "25px"
          }}
        >
          Querying metadata...
        </h1>

        <p
          style={{
            color: "#777"
          }}
        >
          Building a list of
          validation rules,
          workflows and triggers...
        </p>

      </div>

    );

  }
  const stripeAnimation = `

@keyframes moveStripes {

  0% {
    background-position: 0 0;
  }

  100% {
    background-position: 40px 0;
  }

}

`;
  
  return (

  <div
    style={{
      minHeight: "100vh",
      backgroundColor: "#f3f3f3",
      fontFamily: "Arial",
      paddingTop: "60px"
    }}
  >

    <div
      style={{
        width: "700px",
        margin: "auto",
        background: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow:
          "0px 0px 10px rgba(0,0,0,0.1)"
      }} 
    >

      <h1
        style={{
          color: "orange",
          fontSize: "50px"
        }}
      >
        Salesforce Switch
      </h1>

      <p
        style={{
          color: "#666",
          lineHeight: "28px"
        }}
      >
        This tool provides an
        interface to easily
        enable and disable
        components in your
        Salesforce Org.
      </p>

      {!loggedIn ? (

        <div
          style={{
            marginTop: "30px"
          }}
        > 

          <button
            onClick={
              loginToSalesforce
            }
            style={{
              padding:
                "14px 40px",

              fontSize: "18px",

              border: "none",

              backgroundColor:
                "orange",

              color: "white",

              borderRadius: "8px",

              cursor: "pointer"
            }}
          >
            LOGIN
          </button>

        </div>

      ) : (

        <div>

          <h2
            style={{
              color: "#c96b00",
              marginTop: "30px"
            }}
          >
            Logged in as:
          </h2>

          <p>
            <b>Username:</b>{" "}
            {userData.username}
          </p>

          <p>
            <b>Organisation:</b>{" "}
            {userData.organization}
          </p>

          <div
            style={{
              marginTop: "20px",
              marginBottom: "30px"
            }}
          >

            <button
              onClick={logout}
              style={{
                backgroundColor:
                  "#f39c12",

                color: "white",

                border: "none",

                padding:
                  "12px 22px",

                marginRight: "10px",

                borderRadius: "6px",

                cursor: "pointer"
              }}
            >
              LOGOUT
            </button>

            <button
              onClick={
                getMetadata
              }
              style={{
                backgroundColor:
                  "#f39c12",

                color: "white",

                border: "none",

                padding:
                  "12px 22px",

                borderRadius: "6px",

                cursor: "pointer"
              }}
            >
              GET METADATA
            </button>

          </div>

          {metadata && (

            <div
              style={{
                marginTop: "40px"
              }}
            >

              <div
                style={{
                  background: "#dff4ff",
                  padding: "20px",
                  borderRadius: "8px",
                  marginBottom: "25px",
                  color: "#4d6b78",
                  lineHeight: "28px"
                }}
              >
                Use the Off/On switches
                and Deploy button to
                activate or deactivate
                validation rules.
              </div>

              <h2
                style={{
                  color: "#c96b00"
                }}
              >
                {userData.username}
                {" "}
                ({userData.organization})
              </h2>

              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  marginTop: "25px",
                  borderBottom:
                    "1px solid #ddd",
                  paddingBottom: "15px"
                }}
              >
                <b>
                  Validation Rules
                </b>

                <span>
                  Workflows
                </span>

                <span>
                  Process Flows
                </span>

                <span>
                  Triggers
                </span>

              </div>
              
               <div
                style={{
                  marginTop: "20px",
                  marginBottom: "20px"
                }}
              >

                <button
                onClick={() => {
                  setMetadata(originalMetadata);
                }}
                  style={{
                    background:
                      "#f0ad4e",

                    color: "white",

                    border: "none",

                    padding:
                      "12px 18px",

                    borderRadius: "5px",

                    marginRight: "10px"
                  }}
                >
                  ROLLBACK TO ORIGINAL
                </button>

                <button
                 style={{
                    background:
                      "#f0ad4e",

                    color: "white",

                    border: "none",

                    padding:
                      "12px 18px",

                    borderRadius: "5px",

                    marginRight: "10px"
                  }}


                onClick={async () => {
                  setDeploying(true);
                  try {
                    await fetch("http://localhost:5000/deploy-validation-rules",
                      {
                        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          rules: metadata
        })
      }
    );
    setTimeout(() => {
      setDeploying(false);
      setDeploySuccess(true);
    }, 3000);
  } catch (error) {
    console.log(error);
    setDeploying(false);
  }
}}
>
  DEPLOY CHANGES
</button>

              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "flex-end",

                  gap: "10px",

                  marginBottom: "15px"
                }}
              >

                <button
                onClick={() => {

  const updatedRules =
    metadata.map(rule => ({
      ...rule,
      Active: true
    }));

  setMetadata(updatedRules);

}}
                  style={{
                    background:
                      "green",

                    color: "white",

                    border: "none",

                    padding:
                      "8px 15px",

                    borderRadius: "5px"
                  }}
                >
                  ENABLE ALL
                </button>

                <button
                onClick={() => {
                  const updatedRules = metadata.map(rule => ({...rule,
                  Active: false
}));

  setMetadata(updatedRules);

}}
                  style={{
                    background:
                      "red",

                    color: "white",

                    border: "none",

                    padding:
                      "8px 15px",

                    borderRadius: "5px"
                  }}
                >
                  DISABLE ALL
                </button>

              </div>

              <table
                style={{
                  width: "100%",
                  borderCollapse:
                    "collapse"
                }}
              >

                <thead>

                  <tr
                    style={{
                      background:
                        "#f5f5f5"
                    }}
                  >

                    <th
                      style={{
                        padding:
                          "14px",

                        textAlign:
                          "left"
                      }}
                    >
                      Rule Name
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {metadata.map(
                    (rule, index) => (

                      <tr
                        key={index}
                        style={{
                          borderBottom:
                            "1px solid #ddd"
                        }}
                      >

                        <td
                          style={{
                            padding:
                              "15px"
                          }}
                        >
                          {
                            rule.ValidationName
                          }
                        </td>

                        <td>

                          <button
                            onClick={() => {

                              const updatedRules =
                                [...metadata];

                              updatedRules[index].Active =
                                !updatedRules[index].Active;

                              setMetadata(
                                updatedRules
                              );

                            }}
                            style={{

                              background:
                                rule.Active
                                  ? "#3498db"
                                  : "#f0ad4e",

                              color:
                                "white",

                              border:
                                "none",

                              padding:
                                "8px 18px",

                              borderRadius:
                                "6px",

                              cursor:
                                "pointer"

                            }}
                          >

                            {rule.Active
                              ? "ON"
                              : "OFF"}

                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            {deploying && (

  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}
  >

    <div
      style={{
        background: "white",
        width: "650px",
        borderRadius: "8px",
        boxShadow: "0 0 20px rgba(0,0,0,0.3)",
        overflow: "hidden"
      }}
    >

      <div
        style={{
          padding: "20px",
          fontSize: "20px",
          color: "#c47f1d",
          borderBottom: "1px solid #eee"
        }}
      >
        Processing
      </div>

      <div
        style={{
          padding: "25px"
        }}
      >

        <p
          style={{
            color: "#777",
            marginBottom: "20px"
          }}
        >
          Deploying changes. Time will vary depending on number and type of components.
        </p>

        <div
          style={{
            width: "100%",
            height: "25px",
            background: "#f2f2f2",
            borderRadius: "4px",
            overflow: "hidden"
          }}
        >

          <div
            style={{
              width: "100%",
              height: "100%",
              background:
                "repeating-linear-gradient(45deg,#f0ad4e,#f0ad4e 10px,#f7c97f 10px,#f7c97f 20px)",
              animation:
                "moveStripes 1s linear infinite"
            }}
          />

        </div>

      </div>

    </div>

  </div>

)}

              {deploySuccess && (

                <div
                  style={{
                    position:
                      "fixed",

                    top: 0,

                    left: 0,

                    width: "100%",

                    height: "100%",

                    background:
                      "rgba(0,0,0,0.4)",

                    display:
                      "flex",

                    justifyContent:
                      "center",

                    alignItems:
                      "center",

                    zIndex: 9999
                  }}
                >

                  <div
                    style={{
                      background:
                        "white",

                      padding:
                        "30px",

                      borderRadius:
                        "10px",

                      width:
                        "400px",

                      textAlign:
                        "center"
                    }}
                  >

                    <h2
                      style={{
                        color:
                          "green"
                      }}
                    >
                      Complete
                    </h2>

                    <p
                      style={{
                        background:
                          "#dff0d8",

                        padding:
                          "15px",

                        borderRadius:
                          "5px"
                      }}
                    >
                      All changes
                      have been
                      successfully
                      deployed.
                    </p>
                    <button
                      onClick={() => {
                        setDeploySuccess(false);
                        window.location.href = "https://orgfarm-bff4ffa670-dev-ed.develop.my.salesforce-setup.com/lightning/setup/ObjectManager/Account/ValidationRules/view";
                      }}
                      style={{
                        marginTop:
                          "20px",

                        padding:
                          "10px 20px",

                        border:
                          "none",

                        background:
                          "green",
                        color: "white",

                        borderRadius:"5px",

                        cursor:
                          "pointer"
                      }}
                    >

                      CLOSE

                    </button>

                  </div>

                </div>

              )}

            </div>

          )}

        </div>

      )}

    </div>

  </div>


);
}
export default App;