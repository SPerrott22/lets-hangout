import React from 'react';
import Group from '/group.svg';
import MailCheck from '/mail-check.svg';
import CalendarBolt from '/calendar-bolt.svg';
import './Home.css';

function Home() {

	return (
		<div id='app'>
			<div id='introText'>
				<p></p>
				<h1>Welcome to Let's Hangout!</h1>
				<p>
					Schedule hangouts with your friends!
				</p>
			</div>
			<div id='description'>
				<div className='descriptionColumn'>
					<img src={Group} alt="Group" />
					<p>
						Create groups with your friends
					</p>
				</div>
				<div className='descriptionColumn'>
					<img src={MailCheck} alt="Mail Check" />
					<p>
						Invite groups to events
					</p>
				</div>
				<div className='descriptionColumn'>
					<img src={CalendarBolt} alt="Calendar Bolt" />
					<p>
						See your events on a calendar
					</p>
				</div>
				
			</div>
		</div>
	);
}

export default Home;