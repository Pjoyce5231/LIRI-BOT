//this holds all of the dependencies 
require("dotenv").config();
// Importing the API keys
var keys = require("./keys");
// Twitter npm
var Twitter = require("twitter");
// Spotify npm
var Spotify = require("node-spotify-api");
// Request npm
var request = require("request");
// FS npm
var fs = require("fs");
// Initialize the spotify API client using our client id and secret
// I found this in the solution and I'm honestly not sure what it does, 
// but I knew it was necessary
var spotify = new Spotify(keys.spotify);

// below are all of the functions
var writeToLog = function(data) {
  // Append the JSON data and add a newline character to the end of the log.txt file
  fs.appendFile("log.txt", JSON.stringify(data) + "\n", function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("log.txt was updated!");
  });
};

// function that gets the artist's name
var getArtistNames = function(artist) {
  return artist.name;
};

// Function for searching spotify
var getMeSpotify = function(songName) {
  if (songName === undefined) {
    songName = "What's my age again";
  }

  spotify.search({ type: "track", query: songName }, function(err, data) {
    if (err) {
      console.log("Error occurred: " + err);
      return;
    }

    var songs = data.tracks.items;
    var data = [];

    for (var i = 0; i < songs.length; i++) {
      data.push({
        "artist(s)": songs[i].artists.map(getArtistNames),
        "song name: ": songs[i].name,
        "preview song: ": songs[i].preview_url,
        "album: ": songs[i].album.name
      });
    }

    console.log(data);
    writeToLog(data);
  });
};

// Function for searching twitter
var getMyTweets = function() {
  var client = new Twitter(keys.twitter);

  var params = { screen_name: "cnn" };
  client.get("statuses/user_timeline", params, function(error, tweets, response) {
    if (!error) {
      var data = [];

      for (var i = 0; i < tweets.length; i++) {
        data.push({
          created_at: tweets[i].created_at,
          text: tweets[i].text
        });
      }

      console.log(data);
      writeToLog(data);
    }
  });
};

// Function for searching a movie
var getMeMovie = function(movieName) {
  if (movieName === undefined) {
    movieName = "Mr Nobody";
  }

  var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

  request(urlHit, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var jsonData = JSON.parse(body);

      var data = {
        "Title:": jsonData.Title,
        "Year:": jsonData.Year,
        "Rated:": jsonData.Rated,
        "IMDB Rating:": jsonData.imdbRating,
        "Country:": jsonData.Country,
        "Language:": jsonData.Language,
        "Plot:": jsonData.Plot,
        "Actors:": jsonData.Actors,
        "Rotten Tomatoes Rating:": jsonData.Ratings[1].Value
      };

      console.log(data);
      writeToLog(data);
    }
  });
};

// Function for running a command based on text file
var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);

    var dataArr = data.split(",");

    if (dataArr.length === 2) {
      pick(dataArr[0], dataArr[1]);
    }
    else if (dataArr.length === 1) {
      pick(dataArr[0]);
    }
  });
};

// Function for executing user input command
var pick = function(caseData, functionData) {
  switch (caseData) {
  case "my-tweets":
    getMyTweets();
    break;
  case "spotify-this-song":
    getMeSpotify(functionData);
    break;
  case "movie-this":
    getMeMovie(functionData);
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
  default:
    console.log("LIRI doesn't know that");
  }
};

// Function which takes in command line input and executes user input
var runThis = function(argOne, argTwo) {
  pick(argOne, argTwo);
};


runThis(process.argv[2], process.argv[3]);
