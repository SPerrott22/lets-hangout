import React from "react";
import Picture from "/Olivia Wilson.png";
import Group from "/group.svg";
import MailCheck from "/mail-check.svg";
import CalendarBolt from "/calendar-bolt.svg";
import "./Home.css";

function Home() {
  return (
    <div id="app" className="container my-4">
      <div id="introText" className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="card-title text-center">Welcome!</h1>
              <div className="text-center">
                <img
                  src={Picture}
                  alt="Olivia Wilson"
                  className="img-fluid rounded-circle my-3"
                  style={{ maxWidth: "300px" }}
                />
              </div>
              <div id="description">
                <div className="descriptionColumn">
                  <img src={Group} alt="Group" />
                  <p>Create groups with your friends</p>
                </div>
                <div className="descriptionColumn">
                  <img src={MailCheck} alt="Mail Check" />
                  <p>Invite groups to events</p>
                </div>
                <div className="descriptionColumn">
                  <img src={CalendarBolt} alt="Calendar Bolt" />
                  <p>See your events on a calendar</p>
                </div>
              </div>
              <p className="card-text">
                Schedule hangouts with your friends! Discover new places, make
                plans, and enjoy your social life with ease. Let's Hangout is
                your go-to app for connecting with friends and creating
                memorable experiences.
              </p>
              <hr /> {/* Inserted horizontal line */}
              <p className="card-text">
                <small className="text-muted">💙🐻💛 I love CS35L 💛🐻💙</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // =======
  // import React from 'react';

  // function Home() {

  // 	return (
  // 		<div id='app'>
  // 			<div id='introText'>
  // 				<p></p>
  // 				<h1>Welcome to Let's Hangout!</h1>
  // 				<p>
  // 					Schedule hangouts with your friends!
  // 				</p>
  // 			</div>
  // 			<div id='description'>
  // 				<div className='descriptionColumn'>
  // 					<img src={Group} alt="Group" />
  // 					<p>
  // 						Create groups with your friends
  // 					</p>
  // 				</div>
  // 				<div className='descriptionColumn'>
  // 					<img src={MailCheck} alt="Mail Check" />
  // 					<p>
  // 						Invite groups to events
  // 					</p>
  // 				</div>
  // 				<div className='descriptionColumn'>
  // 					<img src={CalendarBolt} alt="Calendar Bolt" />
  // 					<p>
  // 						See your events on a calendar
  // 					</p>
  // 				</div>

  // 			</div>
  // 		</div>
  // 	);
  // >>>>>>> home-page
}

export default Home;
