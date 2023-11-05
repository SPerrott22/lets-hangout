# How to Get Started

## Clone the Repo to Your Local Computer

`git clone https://github.com/SPerrott22/lets-hangout.git`

The React stuff is in the front-end folder while the backend stuff is in the api folder.

## How to Turn on the App

`docker-compose up`

Open the frontend at http://localhost:5173

Open the backend at https://localhost:4000

Access the PostgreSQL at port 5432 on Host 127.0.0.1
Username, Password, and DB name are all "postgres"

The docker-compose.yaml file essentially starts up three containers for the above three parts of our web app. These containers communicate via the above ports but are otherwise isolated from each other.

To turn off the app
`docker-compose down -v`

If you need to install something for package.json for frontend, cd into front-end and then do `npm install X` for whatever you need to install. You'll have to then restart the docker stuff via:
`docker-compose down -v`
`docker-compose build --no-cache`
`docker-compose up`

If you need to install Python libraries via pip3, add them to the requirements.txt in the api folder and they should be auto-installed when you run the Docker.

Note: you may experience some difficulties on a Windows machine. Try removing the following line under "volumes" from the docker-compose.yaml in that case:

```
      - /app/node_modules
```

## Final Remarks

Yay, now please go ahead and implement what you want, do it on your local machine. If the Docker volumes are working, it should update real-time as you make changes.

When you've made changes, please commit them back to the GitHub repo. We can have two branches, one for front-end, one for backend.
