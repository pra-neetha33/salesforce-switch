# Salesforce Switch

A Salesforce-based web application to manage Validation Rules dynamically using Salesforce OAuth and Metadata API deployment.

## Features

* Secure Salesforce Login using OAuth 2.0
* Fetch all Validation Rules from Salesforce
* View Active / Inactive status
* Enable or Disable individual Validation Rules
* Enable All / Disable All functionality
* Rollback to Original State
* Real-time deployment of Validation Rule changes to Salesforce
* Processing and Success popups for deployment flow
* Responsive and user-friendly interface

## Tech Stack

### Frontend

* React.js
* Vite
* CSS

### Backend

* Node.js
* Express.js
* jsforce
* Salesforce Metadata API

## Salesforce Integration

This project uses:

* Salesforce OAuth Authentication
* Salesforce Tooling API
* Salesforce Metadata API

Validation Rule metadata is updated dynamically and deployed directly into Salesforce.

## Project Structure

salesforce-switch/
│
├── client/
│ ├── src/
│ ├── public/
│ └── package.json
│
├── server/
│ ├── index.js
│ ├── package.json
│ └── .env
│
└── README.md

## Environment Variables

Create a `.env` file inside the server folder:

CLIENT_ID=your_salesforce_client_id

CLIENT_SECRET=your_salesforce_client_secret

## Installation

### Frontend

cd client

npm install

npm run dev

### Backend

cd server

npm install

node index.js

## Deployment

* Frontend can be deployed using Vercel
* Backend can be deployed using Render or Railway

## Future Improvements

* Workflow & Trigger Management
* Deployment Error Tracking
* User Role Based Access
* Deployment History Logs
* Better Rollback Mechanism

## Author

Developed as part of a Salesforce Validation Rule Management assignment project.

