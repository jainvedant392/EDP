# EDP

## ENV VARS
Create a .env file at the root of /backend, and add the following variables:

DB_NAME=\
DB_USER=\
DB_PASSWORD=\
DB_HOST=\
DB_PORT=

## Build and start the containers:
Run the command at the root:
- docker compose up --build (to build)
- docker compose up (to start)

This will download the required images, build containers, and start all services.

## Access the application:

- Frontend: http://localhost:3000 
- Backend API: http://localhost:8080 

## For installing dependencies:
### For backend:

Run a command in the backend container:
- docker exec edp_server pip install <package-name>
### OR
- Access the shell in the running container:\
docker exec -it edp_server bash
- Once inside, you can install Python packages:\
pip install {package-name}
- To add the package to requirements.txt:\
pip freeze > requirements.txt

### For frontend:
Run a command in the frontend container:
- docker exec edp_client npm install <package-name>
### OR
- Access the shell in the running container:\
docker exec -it edp_client sh
- Once inside, you can install NPM packages:\
npm install {package-name}
- To install as a dev dependency:\
npm install {package-name} --save-dev


