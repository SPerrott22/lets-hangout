import React from "react";
import { Link } from "react-router-dom";

function About() {
  return (
    <div id="app">
      <div id="introText">
        <h1>Hi, I'm James.</h1>
        <h3>Today, I will be presenting some of my favorite squirrels.</h3>
        <p>
          Currently I go to UCLA. And if you didn't know, there are a{" "}
          <i>bunch</i> of squirrels here. They are all super duper. Sometimes I
          get the intrusive thought to just chase one and try to catch it and
          see what it does. Can you imagine being a squirrel? Do squirrels have
          some knowledge of how small they are? They are <b>tiny</b>. But like
          from there POV they're probably just roaming a world of giants, right?
          Like to them it's normal for a tree to be ginormous or for an ant to
          be like bigger relatively than it is to us. Kinda crazy.
        </p>
        <p>
          Anyways, here's some of my top tier squirrels. I'm just realizing that
          some of these are actually chipmunks. However whatever, I already got
          the images for them and made this site so I don't really feel like
          changing it now. If you're a UCLA person who is reading this, I'm
          sorry for my rodent ignorance.
        </p>
      </div>
      <Link to="/">back</Link>
    </div>
  );
}

export default About;
