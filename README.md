# cs326-TeamLoon
Team Loon's Web App repo

###Overview###

 SofaKing was designed to solve issues of wanting to enjoy videos in-sync with other users. Sometimes there are shows or music that you want 
 to enjoy with others at the same. SofaKing makes it easy to hop into chatrooms in your area, and allows you to explore videos with others. 
 It also provides basic communication needs (VOIP, chatbox) to allow to communicate and discuss topics about the video or just socialize. In 
 addition it includes a voting system that allows users to suggest and pick videos they want to explore. Some chat features are included to 
 prevent poor user experience caused by others (local/global muting, kicking from chatroom). 
 
###How to Run###
 
 ```
 node app.js
 ```
 
###Libraries###
 
 *body-parser*
 
 Middleware for parsing an HTTP body
 
 https://github.com/expressjs/body-parser
 
 *cookie-parser*
 
 Middleware for parsing cookies in an HTTP header
 
 https://github.com/expressjs/cookie-parser
 
 *express-session*
 
 Middleware for supporting sessions in the application
 
 https://github.com/expressjs/session
 
 *connect-flash*
 
 Middleware used for sending messages across sessions
 
 https://github.com/jaredhanson/connect-flash
 
 *morgan*
 
 Middleware used for server logging
 
 https://github.com/expressjs/morgan
 
 *mongojs*
 
 Database support
 
 https://github.com/mafintosh/mongojs
 
###Views###
 
 *About*
 
 The about page is simply a writeup of our project. It includes a brief summary of our application
 and its purpose, case uses of the application, and our app logo.
 
 *Team*
 
 This view provides a brief bio of each team member, his year, and his purpose in the project. It
 also includes our app logo, and a count of the team members (including the legendary John Doe).
 
 *404*
 
 This view is used when the requested page is not found. 
 
 *500*
 
 This page appears when there is an internal serverside error.
 
 *Login*
 
 This page is a simplistic page that allows registered users to login to the website. If a non-logged-in
 user attempts to access a page that only logged in users are allowed to access, the website redirects to the login
 page. The app authenticates the username and password when the user attempts to login and redirects back to the 
 login page if there is a problem.
 
 *Splash*
 
 This is the "main" page of the application; upon connecting to the website, this page is what shows. It includes our team
 logo and links to itself, the team page, and the about page.
 
 *Room View*
 
 This is the temporary chatroom placeholder. Here is where a user will be directed when they join a room and it will include
 the video being watched (synced up to other users) and a chat box.
 
###Statefulness###
 
 [https://github.com/hawmalt/cs326-TeamLoon/blob/master/app.js](App)
 
###Persistence###
 
 The database is used let admins log onto the website when in Admin mode. It keeps track of the admins username and password. Everytime an admin logs in the database checks if and account with the proper credentials exists in the database, otherwise the Admin will receive and error message "Invalid username and password". The database is accomplished using mongodb, and uses mongojs to impliment it into our node application (SofaKing).

[Db] (https://github.com/hawmalt/cs326-TeamLoon/blob/master/db.js)