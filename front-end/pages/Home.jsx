import React from "react";
import Picture from "/Olivia Wilson.png";

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
}

export default Home;
