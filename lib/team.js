//////////////////////////////////////////////////////////////////////
// The team library //////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

/**
 * The `member` function creates a new team member.
 *
 * You should use this function to create new "team members". It is a
 * utility function that can be used in other library routines to
 * create new members. It is a useful technique to abstract the
 * creation of data from the actual data representation itself. In
 * this case a *member* is an object with four important properties:
 *
 * `user`: The username of the member. This should be the username
 * of the team member used to login to UMass Spire, Moodle, etc. You
 * will need to ask your fellow team members for their username.
 * `fname`: The first name of a team member.
 * `lname`: The last name of a team member.
 * `year`: Their current year of college (freshman, sophomore, junior, senior)
 *
 * We give you the implementation of this!
 *
 * @param  {string} user  the team member's username
 * @param  {string} fname the team member's first name
 * @param  {string} lname the team member's last name
 * @param  {string} year  the team member's year of college
 * @return {object} { user, fname, lname, year }
 */
function member(user, fname, lname, year, profile) {
	return {
		user: user,
		fname: fname,
		lname: lname,
		year: year,
		profile: profile
	};
}

// This library contains an internal data structure for recording
// team members. It is an array of member objects. You should add an
// entry for each of your team members. You should use the `member`
// function to easily create a new member object.
var team = [
	// Keep this first member for testing please.
	member('jdoe', 'John', 'Doe', 'Senior', 'This is jdoe: The Man, The Myth, The Legend.'),
	member('acbentle', 'Aaron', 'Bentley', 'Senior', "My primary contributions to this project was handling database interaction and chatroom selection. Using the mapbox api, I integrated a map that uses geolocation to track a user’s location and display the chat rooms near them. The map also uses ajax to frequently poll the servers so that users can idle on the chatroom selection site, and have an updated map to work with, without requiring the user to refresh the page. This allows a user to browse a potentially populated area without having the inconvenience of having to refresh the page to get a new chatroom listing. The map list is populated with a series of pins that user can click on to join a chatroom. In addition users can create new chat rooms by clicking the create chatroom tab. This will create a new room at the user’s current location. In addition the general layout of the chatroom selection and chatbox was designed by me. The app interacts with a database for the purposes of data collection. Sofaking uses a mongodb database to track which videos are getting suggested, how many people are suggesting them, and which videos are getting skipped. This provides us the framework of drawing meaningful conclusions from very large sets of data, and could be useful in predicting a youtube video’s popularity. The app also supports a login system, which has a few admin accounts that allows us to put the site into a ‘maintenance mode’ so that we can edit the website while it is live. This is a simple username password authentication that references a different collection in the mongodb. "),
	member('pgilson', 'Packard', 'Gilson', 'Junior', 'I worked on various different parts of this project, the main focuses being on the voting functionality for both kicking players and voting to skip videos. I also made helped with the creation of certain views and layouts using handlebars. I used CSS to design the homepage, and added bits of CSS to other parts of the website, like tabs on the map view and creating the horizontal nav bar on most the main layouts. I used Aarons implementation of the tabs to easily make a redirect tab on both the roomSelection as well as the roomView pages, this allows users to get back to other parts of the website. For the kicking implementation I used socket.io to communicate between the server and client sides, and I used jquery to handle the button clicks. Kicking players was difficult at first because I did not know how to access the socket id of the user who was to be kicked. Voting to skip videos was pretty simple however. I made the logo, and I also did all the shooting for the video, as well as splicing together our commercial and screencast walkthroughs.I like long walks on the beach, candle lit dinners over a nice glass of red, and\
	well documented code.'),
	member('pjmcd0', 'Patrick', 'McDonough', 'Senior', 'I will be attempting to work on the UI of the app, along with Aaron.\
	Most of my background comes from what I have learned in school so far, in addition to a small internship\
	that I had over the summer. The largest chunk of my coding experience has been in Java, but I have worked\
	a little bit with C and Scala. This class is the first time I have used JavaScript, but hopefully I will pick\
	up some useful stuff.'),
	member('pjhurley', 'Patrick', 'Hurley', 'Junior', 'I will be implementing GeoLocation for our application. I have background programming experience\
	C, Java, Python, and Javascript. My goal for my section is to implement a function that grabs a users coordinates on the world map,\
	then uses those coordinates in order to determine which chat rooms are in an appropriate radius for the user to join. Integration with all\
	parts of the team will be imperative to determine how chat room locations will be defined, how large we want the discovery radius to be, and\
	how the nearby chat rooms will be represented on the front end.'),
    member('tdaigle', 'Timothy', 'Daigle', 'Senior', 'I will be helping with ths erver code, Im also working on some of the design aspects of the sight.\ I have experience with C, Python, and Java. Ive never done anything with a server before though so hopefully it will go well.\ I enjoy listining to music, watching bad horror movies (check out The Howling 3: The Marsupials, its AWFULL), and of course videogames.'),
	member('tdng', 'Timothy', 'Ng', 'Junior', 'I will be working on the server code, and I will be responsible for creating connections between users.\
	I have experience with Java, C++, C, and C#.  I have had some experience with group projects.\
	My interests include playing games, eating, and sleeping.\
	I hope to eventually work at a game company when I graduate.')
];

/**
 * `copy` makes a copy of a member object. This is useful as we do not
 * want to leak our internal member data structures outside of this
 * library. It must be used by the `find` function below to return
 * new/distinct copies of a member object.
 *
 * @param  {member object} member a member object
 * @return {member object}        a copy of member
 */
function copy(member) {

	return {
		user : member.user,
		fname : member.fname,
		lname : member.lname,
		year : member.year,
		profile : member.profile
	};
}

/**
 * `copyAll` returns a copy of all team members in a new array. It
 * relies on your implementation of `copy` to do this.
 *
 * We give you this one!
 *
 * @param  {array} members an array of member objects
 * @return {array}         a copy of the array of member objects
 */
function copyAll(members) {
	var nmembers = [];
	members.forEach(m => {
		nmembers.push(copy(m));
	});
	return nmembers;
}

/**
 * The `result` function is another utility function used to return
 * a "result" object to the caller of this library. Again, a useful
 * technique is to abstract out the creation of an object from its
 * internal representation. In this case, we create a "result" object
 * with four important properties:
 *
 * `success`: this is a boolean indicating if the result is a
 * successful response. true if it is; false otherwise.
 * `message`: this is an informational message that is helpful to
 * the caller to understand the success or failure of the result.
 * `data`: this is the actual data that is returned. In our case the
 * data will always be an array of members.
 * `count`: this is the number of members in the result - this is
 * derived from the number of entries in `data`.
 *
 * @param  {boolean} success true if success; false otherwise
 * @param  {string}  message informational message
 * @param  {array} 	 data    array of members
 * @return {object}          result object
 */
function result(success, message, data) {
	return {
		success: success,
		message: message,
		data: data,
		count: data.length
	};
}

/**
 * `find` is used to lookup a member by their username. It returns
 * a member object if it is found or `null` if it is not.
 *
 * You need to implement this function. You should iterate over the
 * team array looking for the member with the correct username. If the
 * member is found you should return the member object. If it is not
 * found it should return `null`.
 *
 * Make sure you use `copy` to produce a copy of the member object if
 * one is found for the given `user`.
 *
 * @param  {string} user the member's username
 * @return {object}      the member object or `null` if not found
 */
function find(user) {

	var x = 0;
	for (x; x < team.length; x++){
		if(team[x].user === user){
			return copy(team[x]);
		}
	}
	return null;
}

/**
 * `all` returns a result object containing all of the team members.
 * This function always returns `true` as it will always return an
 * array of all the members. Even if there are no members in the team
 * it will return `true` with an empty array. You should use the
 * `result` function to create a result object. The message to the
 * `result` function should be 'team members' (the unit tests will
 * test this).
 *
 * The array of team members returned should be a copy of the original
 * array of team members. `copyAll` is a useful function for this.
 *
 * @return {result object}  a result object
 */
function all() {
	return result(true,'team members', copyAll(team));
}

/**
 * `one` returns a result object containing the team member that was
 * found. This function should check to make sure that the argument
 * `user` passed to it is a string - remember, this is a dynamically
 * typed language so we need to do the type checking manually.
 *
 * If `user` is not a string you must return a result object
 * indicating failure, a useful message, and an empty array. Use the
 * `result` function to do this.
 *
 * Otherwise, you must use the `find` function to find the member. If
 * the member is not found, return a new result object
 * indicating failure, the message 'team member not found', and an
 * empty array.
 *
 * If the member is found, return a result object indicating success,
 * the message 'team member found', and an array containing the single
 * member.
 *
 * @param  {string} user    the username of a team member
 * @return {result object}  a result object
 */
function one(user) {

	var arr = [0];

	if (typeof (user) !== 'string'){
		return result(false, 'Not a string!', arr);
	}

	else{
		var mem = find(user);
		if(mem !== null){
			arr[0] = mem;
			return result(true, 'team member found', arr);
		}
		else{
			return result(false, 'team member not found', arr);
		}
	}
	return null;
}

// This exports public functions to the outside world.
exports.all = all;
exports.one = one;
