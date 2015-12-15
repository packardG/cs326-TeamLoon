# cs326-TeamLoon
Team Loon's Web App repo

Our 3 videos can be found here:
(We encourage you to watch these together using SofaKing!)

-[Code walkthru screencast](https://www.youtube.com/watch?v=VU16cLr1kQM)

-[Application use case screencast](https://www.youtube.com/watch?v=wRFx6xjWZRA)

-[Commercial] (https://www.youtube.com/watch?v=P9Bu_QKzWcI)

###Overview###

 SofaKing was designed to solve issues of wanting to enjoy videos in-sync with other users. Sometimes there are shows or music that you want
 to enjoy with others at the same. SofaKing makes it easy to hop into chatrooms in your area, and allows you to explore videos with others.
 It also provides basic communication needs (to allow to communicate and discuss topics about the video or just socialize. In
 addition it includes a voting system that allows users to suggest and pick videos they want to explore. Some chat features are included to
 prevent poor user experience caused by others (kicking from chatroom). For more information, see our
 [Final Project Document](https://docs.google.com/document/d/10Ry11kDxrAS6hF58ACVqZ_flG4xd5b_fdzNJwG2IOEs/edit?usp=sharing).


###How to Run###

 ```
 node app.js
 ```

 There will be a boolean value inside of the application that will start it in "admin mode", which will only be used when performing maintenance
 on the site. When in admin mode, the user will have to enter a usernamme (grader) and password (a+).

###Libraries###

 *body-parser*

 Middleware for parsing an HTTP body

 https://github.com/expressjs/body-parser

 *cookie-parser*

 Middleware for parsing cookies in an HTTP header

 https://github.com/expressjs/cookie-parser

 *express*

 Middleware for supporting HTTP webpages

 https://github.com/strongloop/express

 *express-handlebars*

 Middleware for supporting handlebars view/templates

 https://github.com/ericf/express-handlebars

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

*socket.io*

Middleware for handling sockets from client and server sides

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

 This is a simplistic page that allows registered users to login to the website. When the application enters "admin mode",
 the site will be locked behind the Login page. The app authenticates the username and password when the administrator
 attempts to login and redirects back to the login page if there is a problem (See the Statefulness section for more
 info).

 *Splash*

 This is the "main" page of the application; upon connecting to the website, this page is what shows. It includes our team
 logo and links to itself, the team page, and the about page. It also includes screenshots and use cases.

 *Room View*

 This is the temporary chatroom placeholder. Here is where a user will be directed when they join a room and it will include

 the video being watched (synced up to other users) and a chat box. It is currently presenting
 a preview of fake chatrooms with a link and simple description.


###Statefulness###

 Our application uses sessions for a very specific purpose. In the event that our website needs heavy maintenance or upkeep,

 it will enter into an "admin mode," during which anonymous users who are not administrators will not be allowed to use the site. This will
 be done by setting an admin-mode boolean to "true", and will gate the entire site behind the login page. This behavior is conducted
 in the [app.js] (https://github.com/hawmalt/cs326-TeamLoon/blob/master/app.js) file, and is intended to prevent anonymous users from
 accessing a non-working version of the site. We will not be implementing named accounts for regular users; this will only be used for
 administrator accounts.


###Persistence###

 The database is used to let admins log onto the website when in maintenance mode. It keeps track of the admins username and password. Every time an admin logs in the database checks if and account with the proper credentials exists in the database, otherwise the Admin will receive and error message "Invalid username and password". The database is accomplished using mongodb, and uses mongojs to implement it into our node application (SofaKing).


[Db] (https://github.com/hawmalt/cs326-TeamLoon/blob/master/db.js)
