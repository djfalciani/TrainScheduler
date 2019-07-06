// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBTpjB6FArPwDvoa5767XqMrfpcNiiwxb8",
    authDomain: "penntest-34a7e.firebaseapp.com",
    databaseURL: "https://penntest-34a7e.firebaseio.com",
    projectId: "penntest-34a7e",
    storageBucket: "",
    messagingSenderId: "1050415218526",
    appId: "1:1050415218526:web:79b044ae51a9746e"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();

  // Add Train Click Event...
  $("#train-add-btn").on("click", function(event) {
    event.preventDefault();

    // Grab input values...
    var xTrainName          = $("#train-name-input").val().trim();
    var xTrainDestination   = $("#train-destination-input").val().trim();
    // var xTrainStart         = $("#train-start-input").val().trim();
    var xTrainStart         = moment($("#train-start-input").val().trim(),"hh:mm").format("X");
    var xTrainFreq          = $("#train-freq-input").val().trim();
    
    var newTrain = {
        name: xTrainName,
        destination: xTrainDestination,
        startTime: xTrainStart,
        Frequency: xTrainFreq
    }

    // Insert new Train Record to DB
    database.ref("/trainScheduler").push(newTrain);

    // Reset Add Train Form Group...
    doResetTrainInputs();

  });

  function doResetTrainInputs() {
    $("#train-name-input").val("");
    $("#train-destination-input").val("");
    $("#train-start-input").val("");
    $("#train-freq-input").val("");
  }

  // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref("/trainScheduler").on("child_added", function(childSnapshot) {
    var dbsTrainName = childSnapshot.val().name;
    var dbsTrainDestination = childSnapshot.val().destination;
    var dbsTrainStart = childSnapshot.val().startTime;
    var dbsTrainFreq = childSnapshot.val().Frequency;

    // Time Manipulations - We want to calculate the Train's next arrival and display it's minutes away value.
    // 1. Next Arrival = Calculate the difference in time between now and start time. Then use modulus to get remainder, which we then use to subtract from the frequency in order to get our minutes away...
    var difference = moment().diff(moment.unix(dbsTrainStart), "minutes");
    var trainRemain = difference % dbsTrainFreq;
    var minUntil = dbsTrainFreq - trainRemain;
    //next arrival time
    var nextArrival = moment().add(minUntil, "minutes").format('hh:mm');

    // Create the new row
    var newRow = $("<tr>").append(
    $("<td>").text(dbsTrainName),
    $("<td>").text(dbsTrainDestination),
    $("<td>").text(dbsTrainFreq),
    $("<td>").text(nextArrival),
    $("<td>").text(minUntil)
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);

});

$("#test").on("click", function() {
  var firstTrain = moment().set('hour', 13).set('minute', 00);
  console.log(moment(firstTrain).format("LT"));

  //calculate difference between times
  var difference =  moment().diff(moment(firstTrain),"minutes");
  console.log(difference);

  
  var nextTrain = moment(firstTrain).add(difference,"m");
  console.log(moment(nextTrain).format("LT"));

  //time apart(remainder)
  var frequency = 15;
  var trainRemain = difference % frequency;
  console.log(trainRemain);

  //minutes until arrival
  var minUntil = frequency - trainRemain;
  console.log(minUntil);
  
  //next arrival time
  var nextArrival = moment().add(minUntil, "minutes").format('hh:mm');
  console.log(nextArrival);
});

$("#test2").on("click", function(event) {
  event.preventDefault();
  
  // var inputStart = $("#train-start-input").val().trim();
  var xTrainStart         = moment($("#train-start-input").val().trim(),"hh:mm").format("X");
  console.log(xTrainStart);

  //makes first train time neater
  var trainTime = moment.unix(xTrainStart).format("LT");
  console.log(trainTime);

  //calculate difference between times
  var difference = moment().diff(moment.unix(xTrainStart), "minutes");
  // var difference =  moment().diff(moment(trainTime),"minutes");
  console.log(difference);
  
  //time apart(remainder)
  var frequency = $("#train-freq-input").val().trim();
  var trainRemain = difference % frequency;
  console.log("Frequency: " + frequency);
  console.log(trainRemain);

  //minutes until arrival
  var minUntil = frequency - trainRemain;
  console.log("Next Arrival in " + minUntil);
  
  //next arrival time
  var nextArrival = moment().add(minUntil, "minutes").format('hh:mm');
  console.log(nextArrival);
});