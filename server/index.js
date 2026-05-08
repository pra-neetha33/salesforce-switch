require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const crypto = require("crypto");
const AdmZip = require("adm-zip");
const fs = require("fs");
const jsforce = require("jsforce");
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:5000/oauth/callback";

let access_token = "";
let instance_url = "";
let currentRules = [];
let conn;

// -----------------------------
// PKCE
// -----------------------------
function base64URLEncode(str) {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest();
}

const code_verifier = base64URLEncode(crypto.randomBytes(32));

const code_challenge = base64URLEncode(
  sha256(code_verifier)
);

// -----------------------------
// LOGIN
// -----------------------------
app.get("/login", (req, res) => {

  access_token = "";
  instance_url = "";

  const authUrl =
    "https://login.salesforce.com/services/oauth2/authorize" +
    "?response_type=code" +
    "&client_id=" + CLIENT_ID +
    "&redirect_uri=" + encodeURIComponent(REDIRECT_URI) +
    "&code_challenge=" + code_challenge +
    "&code_challenge_method=S256" +
    "&prompt=login";

  res.redirect(authUrl);

});

// -----------------------------
// OAUTH CALLBACK
// -----------------------------

app.get("/oauth/callback", async (req, res) => {

  const code = req.query.code;

  try {

    const tokenResponse = await axios.post(
      "https://login.salesforce.com/services/oauth2/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          code: code,
          code_verifier: code_verifier,
        },
      }
    );

    access_token =
      tokenResponse.data.access_token;

    instance_url =
      tokenResponse.data.instance_url;
    conn = new jsforce.Connection({instanceUrl: instance_url, accessToken: access_token
});
    console.log("OAuth Success");
    res.redirect(
      "http://localhost:5173/?success=true");

  } catch (error) {

    console.log(error.response?.data);

    res.send(
      "OAuth Failed"
    );

  }

});
// -----------------------------
// CHECK CONNECTION
// -----------------------------
app.get("/check-auth", (req, res) => {
  if (access_token) {res.json({connected: true,});} 
  else {res.json({connected: false,});}
});

// -----------------------------
// LOGOUT
// -----------------------------
app.get("/logout", (req, res) => {
  access_token = "";
  instance_url = "";
  res.json({success: true,});
});

// -----------------------------
// METADATA
// -----------------------------
app.get("/metadata", async (req, res) => {
  try {
    const response = await axios.get(
      `${instance_url}/services/data/v58.0/sobjects`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const objects = response.data.sobjects.map(
      (obj) => ({
        name: obj.name,
        label: obj.label,
      })
    );

    res.json(objects);} 
    catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json({error: "Metadata fetch failed",});}
});

// -----------------------------
// VALIDATION RULES
// -----------------------------
app.get("/validation-rules", async (req, res) => {
    try {
      const query = `SELECT Id, ValidationName, Active, EntityDefinition.QualifiedApiName
      FROM ValidationRule`;

      const response = await axios.get(
        `${instance_url}/services/data/v58.0/tooling/query/?q=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      currentRules = response.data.records;
      res.json(response.data.records);
    } catch (error) {
      console.log(error.response?.data || error.message);
      res.status(500).json({error: "Validation rules fetch failed",});
    }
  }
);

app.post("/deploy-validation-rules", async (req, res) => {
    try {
      const rules = req.body.rules;

      console.log(
        "Deploying Rules...."
      );
     
      for (const rule of rules) {

  try {

    const metadata =
      await conn.metadata.read(
        "ValidationRule",
        `${rule.EntityDefinition.QualifiedApiName}.${rule.ValidationName}`
      );

    metadata.active =
      rule.Active;

    await conn.metadata.update(
      "ValidationRule",
      metadata
    );

    console.log(
      `${rule.ValidationName} updated`
    );

  } catch (err) {

    console.log(
      `Failed: ${rule.ValidationName}`
    );

    console.log(err);
  }

}
res.json({
    success: true
});
    } catch (error) {
        res.status(500).json({
            success: false
        })
    }
}
);

// -----------------------------
// START SERVER
// -----------------------------

app.get("/", (req, res) => {
  res.send("Salesforce Switch Backend Running");
});
module.exports = app;