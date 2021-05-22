# Theses Web Server and RDF4J repository

## System requirements
- running RDF4J server with available RDF4J Workbench on default port 8080 (server: http://localhost:8080/rdf4j-server/, workbench: http://localhost:8080/rdf4j-workbench)
- **node** and **npm** installed
- to verify the versions installed, use the `node -v` and `npm -v` commands in terminal (cmd, powershell, git bash...)

## Installation steps:
- Access the RDF4J Workbench
- Create a new repository named `grafexamen`
- Add the `subscription_car_graph.ttl` to the repository with the Modify/Add menu of the Workbench (please make sure the "Base URI" and "Context" fields are empty)
- Clone the source code from `git clone https://github.com/kovacsgezatamas/thesis-web-server.git thesis-web-server` <br />
  **OR** extract the `thesis-web-server` folder from the archive and place to an arbitrary directory
- `cd thesis-web-server/` navigate into the root folder of the project (where the `package.json` file is placed)
- `npm install` install dependencies listed in package.json
- `npm start` start the node server written with Express (server is running on port 8099, please make sure the port is not used)

