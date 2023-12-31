# Let's Hangout
A hangout planner to bring college students together. You can create events, add users to the event who can RSVP in their accounts. You can view your events in your calendar page. You can create groups as well! Do all the event scheduling your heart desires here with an open-source application you will love.

## TL:DR
- install Docker Desktop and open it
- `git clone https://github.com/SPerrott22/lets-hangout.git`
- `docker-compose up`
- Open the webpage at http://localhost:5173

## How to Get Started
Prerequisites: install git, docker, and docker-compose.

You should also have node, npm, python3, etc. Also, make sure your computer is connected to your GitHub. This part can be annoying.

Potential Issues for Windows Users:
- when setting up Docker, you may see the following error:
   - `Listing WSL distros: running WSL command: wsl.exe -l -v --all`
   - Windows Subsystem for Linux is required for Docker, to install WSL see https://learn.microsoft.com/en-us/windows/wsl/install
- after running wsl --install and restarting as according to the above, you may see the following error:
  - `WslRegisterDistribution failed with error: 0x80370114`
  - to fix this, in your Windows search bar, search for and open "Turn Windows features on or off"
  - check the options "Virtual Machine Platform" and "Windows Subsystem for "Linux"

### Clone the Repo to Your Local Computer

`git clone https://github.com/SPerrott22/lets-hangout.git`

The React stuff is in the front-end folder while the backend stuff is in the api folder. (You may ignore the nginx folder as this is an optional utility we are currently not using.)

### How to Turn on the App

Open Docker Desktop or whichever installation of Docker you're using

`docker-compose up`

Open the frontend at http://localhost:5173

Open the backend at http://localhost:4000
- Pontential backend issue for Windows users:
  - if the backend doesn't show at http://localhost:4000, look through the `docker-compose up` output for the following error:
    - `api_c   | exec ./entrypoint.sh: no such file or directory`
  - if you see this error, run `git diff HEAD` in your repository. if the output shows that there has been a `^M` character appended to every line of every file, then this is where the issue is stemming from
  - you can run `git reset --hard` to reset the working files to the latest commit (note: if you have made any other changes to the working files, you will lose them)
  - (tentative) git cloning and working exclusively under WSL may prevent this issue from happening in the future

The docker-compose.yaml file essentially starts up two containers for the above two parts of our web app. These containers communicate via the above ports but are otherwise isolated from each other.

The backend sends requests to a free-tier persistent cockroach db serverless PostgreSQL server that stores our user data. You can interact with it by sending JSON formatted HTTP requests to our backend server.

E.g. using Postman Agent you may put in a GET request to http://localhost:4000/users to see the current user data in our database.

Similarly, you can put in a POST request at http:/localhost:4000/users to create a new user:
```JSON
{
 "username":"testuser",
 "email":"silly@yahoo.com"
}
```

Another cool feature is that you can make edits to all the files besides the docker-compose.yaml and it will make updates in real-time thanks to our volume configuration.

To stop the containers temporarily

`docker-compose stop`

To restart them

`docker-compose start`

To turn off the app

`docker-compose down`

If you wish to remove all images and volumes you may do

`docker-compose down --rmi all -v`

WARNING: this can be bad if you've made edits to Dockerfiles, you'll lose an old image!

If you need to install something for package.json for frontend, cd into front-end and then do `npm install X` for whatever you need to install. You'll have to then restart the docker stuff via:

`docker-compose down -v`
`docker-compose build --no-cache`
`docker-compose up`

If you need to install Python libraries via pip3, add them to the requirements.txt in the api folder and they should be auto-installed when you run the Docker. If you want to activate the Python environment within the api folder, you can use:

`source env/bin/activate`

I'm not sure this is needed though because it already has it's own Docker container so you can basically not worry about the pip3 installs in the requirements.txt affecting your local machine away.

Note: you may experience some difficulties on a Windows machine. Try removing the following line under "volumes" from the docker-compose.yaml in that case:

```
      - /app/node_modules
```

The intention of this line was to create an anonymous volume to store the node_modules folder so that if you accidentally delete it on your local machine, the container will still have its own. Pro tip: don't delete it.

For collaborators only: you can view the CockroachDB cluster called "lets-hangout" on your CockroachDB account. Here you may conveniently perform SQL queries and assess analytics.

### Final Remarks

Yay, now please go ahead and implement what you want (e.g. start putting ChatGPT APIs into the Python code, maybe make some more .py files and link together, add some more .jsx files in the front-end section, change versions as you see fit via the above-mentioned methods), do it on your local machine. If the Docker volumes are working, it should update real-time as you make changes.

When you've made changes, please commit them to a separate branch on the GitHub repo. It might be helpful to name your branch with your name so we don't come up with similar names. Feel free to force a merge with main if it 100% works but if it's iffy, I put in a rule where at least one other person besides you needs to approve a pull-request to merge to main. You can of course override this if you're 100% sure it's good.

### Appendix: Some useful git stuff

First time only:
```console
$ cd ~/wherever/you/want/to/go/to/store/a/copy/of/stuff-to-work-on/
$ git clone https://github.com/SPerrott22/lets-hangout.git
```
(This automatically does the `git init` stuff, so don't worry about that, `git init` is just for like starting out on local.

Everytime:
```console
$ git fetch --all --prune # ensures you have latest branch information available, but it doeesn't affect local yet
$ git branch # to list all local branches
$ git switch existing-branch-name # if you want to create a new local branch, do git switch -c new-branch-name
$ git pull origin branch-name # if you want to override your local with the remote stuff

$ # do stuff like touching files, editing files, mkdir etc. so long as it's within your project folder where you did the clone

$ git add -A # add all your new stuff to staging area
$ git commit -m "Explain what you did."
$ git push -u origin branch-name # push it to GitHub. You may have to set up SSH or HTTPS authentication, follow their tutorials.
$ # -u just means in future if you do `git push` will be same as `git push origin feature-or-fix-branch` and `git pull` same as `git pull origin feature-or-fix-branch`


$ # if you're just doing small bug fixes and want to make local branches but merge them back without dealing with GitHub

$ # do stuff in your "testing" branch (you can use any name)
$ git switch main # go back to main branch or whatever GitHub branch you're working on
$ git merge testing # begin merge process
$ git commit # finish it
$ git branch -d testing # delete the local testing branch


$ # other handy tools
$ git branch -r # list remote branches
$ git branch -a # list remote + local branches
$ git diff
$ git remote -v # view remote repos and their names
$ git remote remove repo-nickname # if you don't want this repo
$ git remote add repo-nickname https://github.com/linktorepo.git 
$ git log
$ git mv file_from file_to # renaming files
$ git status
$ git commit --amend # if you just made a message typo
$ git restore FILENAME # if you want to discard any uncommitted changes to it

$ # regarding pull-requests: you do that in GitHub on a browser.
$ # further research: rebasing.
```

## TO-DO
1) meet up to talk about stuff
2) now that the backend is persistent, it's time to configure our tables to store what we want and make a user authentication portal. Maybe Firebase SDK?
3) a Figma mockup and somebody to start making the front-end. Consider using Tailwind instead of SCSS
4) the backend peeps to add a Google Calendar integration and OpenAI ChatGPT integration or fetching or something. And figure out what our input/ouput is going to be.
5) figure out our persistent database for storing users information.
6) potentially use [Vercel](https://vercel.com/) for free web hosting and [CockroachDB](https://www.cockroachlabs.com/blog/why-postgres/) for free persistent DB since it works well with PostgreSQL

### Links: (accessible only to collaborators)
[Official Schedule](https://docs.google.com/document/d/18CVAa7x0p81EIlmhSwevdX1e9p91VaN9H7_z0aK3GY4/edit?usp=sharing)

[Project Proposal](https://docs.google.com/document/d/1pcBcbz_itiW3kw4zLuwpz3pQPqzzmZLH82ii28W8zP0/edit#heading=h.ck9tcfup1nn4)

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
* https://github.com/arecvlohe/rbc-starter

&copy; 2023 by Joshua Zhu, Joshua Li, Samuel Perrott, Matthew Toutounjian, Andrew Liang.
