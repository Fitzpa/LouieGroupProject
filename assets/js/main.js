// Initialize Firebase
var config = {
  apiKey: "AIzaSyCMJ01rD9Ucqh2KEUE79yEpPMNvanTFGZg",
  authDomain: "louiefirstproject.firebaseapp.com",
  databaseURL: "https://louiefirstproject.firebaseio.com",
  projectId: "louiefirstproject",
  storageBucket: "louiefirstproject.appspot.com",
  messagingSenderId: "940218817270"
};
firebase.initializeApp(config);
// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var globalUser;
var userPref;
var news;
var todoLength;
var todoItem;
var todoArray;

// if there is a user signed in the global variable 'globalUser' is equal to the user
// this keeps the user authorization active on all pages
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("hello");
    globalUser = user;
    $("#loginId").hide();
    $("#preferenceId").show();
    $("#signOutButton").show();
    $("#todoApp").show();
    // userPref =
    newsPrefReff = database.ref(
      "/users/" + globalUser.uid + "/newsPreferences/"
    );
    todoItemRef = database.ref("/users/" + globalUser.uid + "/todoItems/");
    todoItemkeys = database
      .ref("/users/" + globalUser.uid + "/todoItems/")
      .orderByKey();

    newsPrefReff.on("value", function(snapshot) {
      console.log("------------------------------");
      console.log(snapshot.val());
      
    });

    todoItemRef.on("value", function(snapshot) {
      console.log(snapshot.numChildren());
      todoLength = snapshot.numChildren();

      console.log("todoItems: " + todoLength);
      if (!todoLength === 0) {
        todoItemkeys = database
          .ref("/users/" + globalUser.uid + "/todoItems/")
          .orderByKey();
        var i = 0;
        todoItemRef.on("value", function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            console.log("+++++++");
            console.log(key);
            console.log(childData);
            todoArray[i].push(childData);
            $("#todoUl").append(
              "<li id='todoLi'><span id='todoSpan'><i class='fas fa-trash'></i> </span>" +
                childData +
                "</li>"
            );
            i++;
          });
        });
      } else {
        console.log("there are no todo items");
      }
    });
  } else {
    $("#loginId").show();
    $("#preferenceId").hide();
    $("#signOutButton").hide();
    $("#todoApp").hide();
  }
});

///////////////////////////SIGN IN SECTION//////////////////////////////////
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      console.log(authResult);
      console.log("signed in");

      return false;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById("loader").style.display = "none";
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: "popup",
  signInSuccessUrl: "preferences.html",
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID]
};
// The start method will wait until the DOM is loaded.

/// talking to firebase to read and write information
var database = firebase.database();

//  Array of possible news preferences
var newsPref = ["Sports", "World", "Politics"];

// Function for displaying news buttons

// This redirects the user to the home page
function Redirect(location) {
  window.location = location;
}

//////////////SIGN OUT FUNCTION////////////////////////
$(document).on("click", "#signOutButton", function(event) {
  event.preventDefault();
  firebase
    .auth()
    .signOut()
    .then(function() {
      console.log("Sign-out successful.");
    })
    .catch(function(error) {
      // An error happened.
    });
  Redirect("index.html");
});
var zipCode;
//////  GET IP ADDRESS ///////
var ipAddress;

$.getJSON("https://api.ipify.org?format=json", function(data) {
  ipAddress = data.ip;
});

/////////////////////////////////NEWS////////////////////////////////////
var newsUrl = newsQueryURL();
// Ajax call to get news from NYT
$.ajax({
  url: newsUrl,
  method: "GET"
}).then(displayNews);

//getWeather();

/**
 * get preference information from from db otherwise default values will be used
 * @returns {string} URL for NYT API based
 */
function newsQueryURL() {
  // queryURL is the url we'll use to query the API
  var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";
  // Set the API key
  var queryParams = {
    "api-key": "XIW58kpN63We5nGfdQE45koBdpNVyKvU"
  };
  // Grab user preferences from DB is user registered
  //
  // Set user parameters for query
  
  if (news === 0) {
    queryParams.q = news;
  } else {
    queryParams.q = "technology";
  }

  return queryURL + $.param(queryParams);
}

function displayNews(newsData) {
  var numHeadLines = 3;
  console.log(newsData);
  var divId = 0;
  var div = "";

  var $news = $("<div>");

  // Loop through and build elements for the defined number of articles
  for (var i = 0; i < numHeadLines; i++) {
    // Get specific article info for current index
    var article = newsData.response.docs[i];
    var newDiv = $("<div>");
    //Get headline and Url to display
    var headline = article.headline.print_headline;
    var headLineUrl = article.web_url;

    console.log("head line : ", headline);
    console.log("head line : ", headline);
    //var byline = article.byline;
    //var section = article.section_name;
    //var pubDate = article.pub_date;
    //var $news.append("<a href='" + headLineUrl + "'>' +  "'<strong> '" + headline +  "</strong>" +"</a>");

    $news.append(
      "<a href='" +
        headLineUrl +
        "' target='_blank'> <h3>" +
        headline +
        "</h3></a><hr>"
    );
  }
  // Add div element to the DOM
  $(".news").append($news);
}

// function getWeather() {
//   var apiKey = "59e2552e8cb340c483081480d54a2aca";
//   var zip = "55101";

//   var api_url = 'https://api.openweathermap.org/data/2.5/weather?zip=' + zip + '&units=imperial&appid=' + apiKey + "&JSONP=displayWeather";
//   $.ajax({
//       url: api_url,
//       method: "GET"
//   }).then(displayWeather);

// }

// function displayWeather(data) {
//   console.log("WEATHER ->", data);

//   var tempr = data.main.temp;

//   var location = data.name;
//   var desc = data.weather[0].description;
//   var icon = data.weather[0].icon;
//   var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png"
//   console.log("ICON  ->", iconUrl);

//   $('.city').text(location);
//   $('.temp').text(tempr.toFixed(0) + '° F');
//   var $weather_icon = $('<hr><img class="icon" src="' + iconUrl + '">');
//   $(".city").append($weather_icon);
// }
