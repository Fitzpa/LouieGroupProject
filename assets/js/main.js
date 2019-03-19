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

// if there is a user signed in the global variable 'globalUser' is equal to the user
// this keeps the user authorization active on all pages
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    globalUser = user;
    // userPref =
    console.log("The logged in user is: " + globalUser.displayName);
  }
});

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      console.log(authResult);

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

// This is the signout function
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


