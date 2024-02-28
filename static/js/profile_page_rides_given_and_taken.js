/**
 * Created by Dr.Kimpatrick on 7/31/2018.
 */
import {getFromCurrentUserInfo, hostAndPortUrl, loginPageUrl, acceptedRideUrl, getTokenFromVerifyUser, logoutUser, getCurrentUserBio, getCurrentUserEmail, getCurrentUserPhoneNumber, logResult, rejectOrAcceptUrl} from './main.js'

// is displayed in the navigation bar
let usernameDisplayArea = document.getElementById('currentLoginUsername');
usernameDisplayArea.innerText = getFromCurrentUserInfo();

let displayUsernameArea = document.getElementById('displayUsername');
displayUsernameArea.innerText = getFromCurrentUserInfo();

let displayUserEmailArea = document.getElementById('displayUserEmail');
displayUserEmailArea.innerText = getCurrentUserEmail();

let displayUserPhoneArea = document.getElementById('displayUserPhone');
displayUserPhoneArea.innerText = getCurrentUserPhoneNumber();

let displayUserBioArea = document.getElementById('displayUserBio');
if (getCurrentUserBio()){
    displayUserBioArea.innerText = getCurrentUserBio();
}

let logoutThisUser = document.getElementById('logoutThisUser');
logoutThisUser.onclick = function () {
    logoutUser();
};

let giveRidesDisplayArea = document.getElementById('giveRidesDisplayArea');
let takenRidesDisplayArea = document.getElementById('takenRidesDisplayArea');


function displayRidesGiven(result) {
    let error = result['message']; // missing or expired token
    let rides = result[getFromCurrentUserInfo()+"'s ride offers"];

    let numOfRidesGivenDisplayArea = document.getElementById('numOfRidesGiven');
    numOfRidesGivenDisplayArea.innerText = rides.length;
    if (error){
        // Redirect to the login page
        window.location.replace(loginPageUrl);

    }else {
        let myHTML = '';
        for(let index in rides) {
            let dict = rides[index];

            myHTML += `
            <div class="ride_template" id=${dict['ride_id']}>
                <table> 
                    
                    <tr> 
                        <th>Origin</th> 
                        <td id="origin">${dict['origin']}</td> 
                    </tr> 
                    <tr> 
                        <th>Destination</th> 
                        <td id="destination">${dict['destination']}</td> 
                    </tr> 
                    <tr> 
                        <th>Meetpoint</th> 
                        <td id="meetpoint">${dict['meet_point']}</td> 
                    </tr> 
                    <tr> 
                        <th>Start date</th> 
                        <td id="start_date">${dict['start_date']}</td> 
                    </tr> 
                    <tr> 
                        <th>Start date</th> 
                        <td id="start_date">${dict['finish_date']}</td> 
                    </tr> 
                    
                </table>
            </div>
        
        `;
        }
        giveRidesDisplayArea.innerHTML = myHTML;

    }
    activateDiv();

    // This callback function is placed here to ensure that the first functio
    //  that displays rides given is fully executed
    const taken_rides_uri = hostAndPortUrl+"/api/v1/this/user/rides/taken";

    let myHeader = new Headers({"Content-Type": "application/json",
                              "Authorization": getTokenFromVerifyUser()});

    // new Request(uri, option);
    let option_taken_rides = {
        method: "GET",
        //credentials: "same-origin",
        headers: myHeader
    };

    let taken_rides_req = new Request(taken_rides_uri, option_taken_rides);

    //getAllRidesJSON(rides_req);
    getTakenRidesJSON(taken_rides_req);

}


function readRidesResponseAsJSON(response) {
    return response.json();
  }

function getAllRidesJSON(pathToResource) {
    fetch(pathToResource)
    .then(readRidesResponseAsJSON)
    .then(displayRidesGiven)
  }

const rides_uri = hostAndPortUrl+"/api/v1/this/user/rides";

let user_h = new Headers({"Content-Type": "application/json",
                          "Authorization": getTokenFromVerifyUser()});

// new Request(uri, option);
let option = {
    method: "GET",
    //credentials: "same-origin",
    headers: user_h
};

let rides_req = new Request(rides_uri, option);

getAllRidesJSON(rides_req);

function activateDiv(){
    let rideDivs = document.getElementsByClassName('ride_template');

    [].forEach.call(rideDivs, (mydiv) => {
        mydiv.addEventListener('click', () => {
            logResult("givenRideId", mydiv.id);
            window.location.replace(rejectOrAcceptUrl);
        })
    });
}


/*******************************************************************************/

function displayRidesTaken(result) {
    console.log(result);
    let error = result['message']; // missing or expired token
    let rides = result["Rides taken by "+getFromCurrentUserInfo()];
    console.log(rides.length);

    let numOfRidesTakenDisplayArea = document.getElementById('numOfRidesTaken');
    numOfRidesTakenDisplayArea.innerText = rides.length;
    if (error){
        // Redirect to the login page
        window.location.replace(loginPageUrl);

    }else {
        let myHTML = '';
        for(let index in rides) {
            let dict = rides[index];

            myHTML += `
            <div class="taken_ride_template" id=${dict['ride_id']}>
                <table> 
                    
                    <tr> 
                        <th>Origin</th> 
                        <td id="origin">${dict['origin']}</td> 
                    </tr> 
                    <tr> 
                        <th>Destination</th> 
                        <td id="destination">${dict['destination']}</td> 
                    </tr> 
                    <tr> 
                        <th>Meetpoint</th> 
                        <td id="meetpoint">${dict['meet_point']}</td> 
                    </tr> 
                    <tr> 
                        <th>Start date</th> 
                        <td id="start_date">${dict['start_date']}</td> 
                    </tr> 
                    <tr> 
                        <th>Start date</th> 
                        <td id="start_date">${dict['finish_date']}</td> 
                    </tr> 
                    
                </table>
            </div>
        
        `;
        }
        takenRidesDisplayArea.innerHTML = myHTML;
    }
    activateDivRidesTaken()
}


function readTakenRidesResponseAsJSON(response) {
    return response.json();
  }

function getTakenRidesJSON(pathToResource) {
    fetch(pathToResource)
    .then(readTakenRidesResponseAsJSON)
    .then(displayRidesTaken)
  }

function activateDivRidesTaken(){
    let rideDivs = document.getElementsByClassName('taken_ride_template');

    [].forEach.call(rideDivs, (mydiv) => {
        mydiv.addEventListener('click', () => {
            logResult("takenRideId", mydiv.id);
            window.location.replace(acceptedRideUrl);
        })
    });
}

// control the rides displayed on button click
// that is lists of rides given or taken
let ridesGivenButtonArea = document.getElementById("ridesGivenButton");
let ridesTakenButtonArea = document.getElementById("ridesTakenButton");

ridesGivenButtonArea.addEventListener("click", function (event) {
    event.preventDefault();
    // display only ridesGiven on click
    document.getElementById("giveRidesDisplayArea").style.display = "block";
    document.getElementById("takenRidesDisplayArea").style.display = "none";
    // alter the active status of the RidesButton
    ridesGivenButtonArea.className = "active_ride_status";
    ridesTakenButtonArea.className = "inactive_ride_status";


});

ridesTakenButtonArea.addEventListener("click", function (event) {
    event.preventDefault();
    // display only ridesTaken on click
    document.getElementById("takenRidesDisplayArea").style.display = "block";
    document.getElementById("giveRidesDisplayArea").style.display = "none";
    // alter the active status of the RidesButton
    ridesTakenButtonArea.className = "active_ride_status";
    ridesGivenButtonArea.className = "inactive_ride_status";

});