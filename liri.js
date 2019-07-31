// This Reads and Sets an Enviorment Variable 
require("dotenv").config();

//These files need to be imported
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

//These take in CL arguements 
var liriCom = process.argv[2];
var input = process.argv.slice(3).join(" ");

//This seperates logs 
var divider =
  "\n------------------------------------------------------------\n\n";

// LIRI Commands for Concert-this, spotify-this-song, movie-this, do-what-it-says
//  I will use the switch statement, this allows me to perform diffrent actions based on the conditions.
function command(liriCom, input) {
  switch (liriCom) {
    case "concert-this":
      conInfo(input);
      break;

    case "spotify-this-song":
      spotInfo(input);
      break;

    case "movie-this":
      movInfo(input);
      break;

    case "do-what-it-says":
      doThis();
      break;
  }
}

// "concert-this" function
function conInfo(input) {
  var queryUrl =
    "https://rest.bandsintown.com/artists/" +
    input +
    "/events?app_id=codingbootcamp";


  // GET Request.
  axios.get(queryUrl).then(function(response) {
    var bandInfo = response.data[0];
    var eveInfo = [
      "Band:" + bandInfo.lineup,
      "Venue:" + bandInfo.venue.name,
      "City:" + bandInfo.venue.city,
      "Date:" + moment(bandInfo.datetime).format("MM DD YYYY")
    ].join("\n\n");
    fs.appendFile("log.txt", eveInfo + divider, function(err) {
      if (err) throw err;
      console.log(eveInfo);
    });
  });
}

//"spotify-this-song" function
function spotInfo(songName) {
  var spotify = new Spotify(keys.spotify);

  //If no song is provided, use "The Sign"
  if (!songName) {
    songName = "The Sign";
  }

  //Search for Song Name Using Spotify
  spotify.search({ type: "track", query: songName }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    var songInfo = [
      "Artist: " + data.tracks.items[0].artists[0].name,
      "Song name: " + data.tracks.items[0].name,
      "Album Name: " + data.tracks.items[0].album.name,
      "Preview Link: " + data.tracks.items[0].preview_url
    ].join("\n\n");
    fs.appendFile("log.txt", songInfo + divider, function(err) {
      if (err) throw err;
      console.log(songInfo);
    });
  });
}

//"movie-this" function
function movInfo(movieName) {
  
    //If no movie is provided, use "Mr. Nobody" 
  if (!movieName) {
    movieName = "mr nobody";
  }
  var queryUrl =
    "https://www.omdbapi.com/?t=" +
    movieName +
    "&y=&plot=short&r=json&tomatoes=true&apikey=trilogy";

  // GET Request
  axios.get(queryUrl).then(function(response) {
    var movieResult = response.data;
    var listing = [
      "Title:" + movieResult.Title,
      "Year:" + movieResult.Year,
      "IMDB Rating:" + movieResult.Ratings[0].Value,
      "Rotten Tomatoes Rating:" + movieResult.Ratings[1].Value,
      "Country:" + movieResult.Country,
      "Language:" + movieResult.Language,
      "Plot:" + movieResult.Plot,
      "Actors:" + movieResult.Actors
    ].join("\n\n");
    fs.appendFile("log.txt", listing + divider, function(err) {
      if (err) throw err;
      console.log(listing);
    });
  });
}

// User Input
function doThis() {
	fs.readFile('random.txt', "utf8", function(error, data){

		if (error) {
    		return console.log(error);
  		}
		var dataArr = data.split(",");

		// If statement used to loop through the commands that might be present in random.txt
		if (dataArr[0] === "spotify-this-song") {
			var songcheck = dataArr[1].slice(1, -1);
			spotInfo(songcheck);
		} else if (dataArr[0] === "concert-this") {
			var concert = dataArr[1].slice(1, -1);
			conInfo(concert);
		} else if(dataArr[0] === "movie-this") {
			var listing = dataArr[1].slice(1, -1);
			movInfo(listing);
		} 
		
  	});

};

command(liriCom, input);