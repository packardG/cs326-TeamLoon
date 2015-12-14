/**
 * Created by Hawmalt on 12/13/2015.
 */
var first = 0;
var vidArr = [];

var socket = io();
// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        //videoId: 'qaddgd8UI90',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    //event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        socket.emit('remove vid');
        $('#videoQ li').eq(0).remove();
        if(vidArr.length == 0){
            first = 0;
            socket.on('suggest video', function (data) {
                //$('#videoQ').append($('<li>fg').text(data.suggestedvideo));
                socket.emit('change video', vidArr);
            });
        }
        else{
            console.log("should play next vid");
            player.loadVideoById(vidArr[0]);
            $('#videoQ li').eq(0).remove();
            vidArr.shift();
        }
    }
    else if(event.data === YT.PlayerState.PLAYING){
        console.log('Playing');
        socket.emit('PlayVideo', player.getCurrentTime());

    }
    else if(event.data === YT.PlayerState.PAUSED){
        console.log('Paused');
        socket.emit('PauseVideo', player.getCurrentTime());
    }
    else if (event.data === onError){

    }
}


function onButtonVoteClick(element){
    var userName = element.innerHTML;
    var txt;
    var msg = confirm("Initiate vote to kick?");
    if (msg === true) {
        txt = "Initiating Vote...";
        socket.emit("Call Vote", userName);
    } else {
        txt = "Vote cancelled";
    }
    document.getElementById("demo").innerHTML = txt;
}

$( document ).ready(function() {


    var query = window.location.search.slice(10);
    socket.emit('adduser', {room: query});

    $('#chatInput').submit(function (e) {
        e.preventDefault();
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function (userName, message) {
        $('#chatlog').append($('<li>').text(userName + ": " + message));
    });

    $('#suggestInput').submit(function (e) {
        e.preventDefault();
        socket.emit('suggest video', {suggestedvideo: $('#videoSuggestion').val()});
        $('#videoSuggestion').val('');
        return false;
    });

    socket.on('Vote Kick', function(userName){
        var msg = confirm("Kick " + userName + "?");
        if(msg === true){
            socket.emit("kick player", 'yes', userName);
        } else{
            //   prompt("Vote cancelled");
            socket.emit("kick player", 'no', userName);
        }

    });

    $('#voteVideo').click(function(){
        socket.emit('skip video');
    });

    socket.on('video vote', function(){
        var msg = confirm("Skip to next video in queue?");
        if(msg === true){
            socket.emit("handle skip", 'yes');
        } else{
            socket.emit("handle skip", 'no');
        }
    });

    socket.on('suggest video', function (data) {
        $('#videoQ').append($('<li>fg').text(data.suggestedvideo));
    });

    socket.on('change video', function (data) {
        vidArr = data.videoAr.slice(0);
        console.log(vidArr);
        if(first === 0){
            console.log('in the first if statement');
            player.loadVideoById(vidArr[0]);
            //vidArr.shift();
        }
        first = 1;
        console.log(vidArr);

    });

    socket.on('pop vid', function(){
        console.log('popping top vid' + vidArr);
        vidArr.shift();
        $('#videoQ li').eq(0).remove();
        if(vidArr.length > 0){
            player.loadVideoById(vidArr[0]);
        }

    });

    socket.on('PlayVideo', function(time){

        //Ignore any outdated play requests
        if(Math.abs(time-player.getCurrentTime()) > 2){
            return;
        }
        player.playVideo();
    });

    socket.on('PauseVideo', function(time){
        player.pauseVideo();
        if(Math.abs(time-player.getCurrentTime()) > 2){
            player.seekTo(time, true);
        }
    });

    socket.on('update userLists', function(userlist){
        //Clear the list of the old list of users
        $('#listOfUsers').empty();

        //Then fill the list with the new list of users
        for(var i = 0; i < userlist.length; i++){
            $('#listOfUsers').append($('<div id="box">').text(userlist[i]));
        }

        //Same with the voting list
        $('#votelist').empty();

        //Then fill the list with the new list of users
        for(var i = 0; i < userlist.length; i++){
            $('#votelist').append($('<button id="voteButton" onClick="onButtonVoteClick(this)">').text(userlist[i]));
        }

    });

    socket.on('force disconnect', function(){
        alert("You have been kicked");
    });
});