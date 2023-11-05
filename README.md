# Let's Hangout
A hangout planner to bring college students together.

## How to Get Started
Prerequisites: install git, docker, and docker-compose. You should also have node, npm, python3, etc.

### Clone the Repo to Your Local Computer

`git clone https://github.com/SPerrott22/lets-hangout.git`

The React stuff is in the front-end folder while the backend stuff is in the api folder.

### How to Turn on the App

`docker-compose up`

Open the frontend at http://localhost:5173

Open the backend at http://localhost:4000

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

### Final Remarks

Yay, now please go ahead and implement what you want, do it on your local machine. If the Docker volumes are working, it should update real-time as you make changes.

When you've made changes, please commit them back to the GitHub repo. We can have two branches, one for front-end, one for backend.

**Sources**
* https://www.youtube.com/watch?v=fHQWTsWqBdE
* https://github.com/tko22/flask-boilerplate
* https://flask.palletsprojects.com/en/3.0.x/quickstart/
* https://www.digitalocean.com/community/tutorials/how-to-create-your-first-web-application-using-flask-and-python-3
* https://dev.to/nagatodev/getting-started-with-flask-1kn1
* https://towardsdatascience.com/build-deploy-a-react-flask-app-47a89a5d17d9
* https://dev.to/nagatodev/building-a-todo-list-application-with-flask-fcj
* https://github.com/uclaacm/hothX-workshops/tree/main/intro-to-servers
* https://www.youtube.com/watch?v=31ieHmcTUOk&list=PL4cUxeGkcC9hxjeEtdHFNYMtCpjNBm3h7
* https://github.com/FrancescoXX/flask-crud-live/blob/main/app.py
* https://github.com/uclaacm/hackschool-f23/blob/main/Session-2/src/App.jsx

&copy; 2023 by Joshua Zhu, Joshua Li, Samuel Perrott, Matthew Toutounjian, Andrew Liang.
