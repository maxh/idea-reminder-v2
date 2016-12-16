import React from 'react';

import { Grid, Row, Col } from 'react-bootstrap';

const About = () => {
  return (
    <div>
      <div>I made this service to encourage myself to be more creative.
        Building new things is fun and rewarding, and it all starts with an
        idea. Hope you find it useful!</div>
      <h1>Frequently asked questions</h1>
      <h2>Are my ideas private?</h2>
      <p>Yes! See our <a href="/terms">privacy policy</a> for details.</p>
      <h2>Do I have to respond to the email immediately?</h2>
      <p>Nope! Once you have the email address, the daily emails are simply
        friendly reminders. You can respond to that email anytime you have
        a new idea and we will store it for you.</p>
      <h2>After a few reminders I don't have any ideas. What do I do?</h2>
      <p>Try to think about times during the day when you had a problem or
        experienced frustration. How would you fix that? Did anyone else
        have a problem?
      </p>

      <h1>Rarely asked questions</h1>
      <h2>I like the background image on the homepage. Where's it from?</h2>
      <p>Glad you like it. It was inspired by a photograph from Twin Peaks
        overlooking Marin Country at sunrise. You can purchase a print (or a towel)
        with the image on <a href="https://society6.com/product/marin-sunrise_print#s6-6312254p4a1v45">Society6</a>.</p>
    </div>
  );
}

export default About;
