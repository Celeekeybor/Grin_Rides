/**
 * Created by Dr.Kimpatrick on 7/25/2018.
 */

import {loginPageUrl, hostAndPortUrl, logoutUser, getTokenFromVerifyUser, getFromCurrentUserInfo, logResult} from './main.js'


export function loadAvailableRides() {

let loginUsernameDisplayArea = document.getElementById("currentLoginUsername");

let toContainRides = document.getElementById("availableRideArea");

function logResultRides(result) {
    let error = result['message']; // missing or expired token
    let rides = result['Rides'];

    if (error){
        // Redirect to the login page
        window.location.replace(loginPageUrl);

    }else {
        loginUsernameDisplayArea.innerText = getFromCurrentUserInfo();
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
        toContainRides.innerHTML = myHTML;

    }
    activateDiv()
}


function readRidesResponseAsJSON(response) {
    return response.json();
  }

function getAllRidesJSON(pathToResource) {
    fetch(pathToResource)
    .then(readRidesResponseAsJSON)
    .then(logResultRides)
  }


const rides_uri = hostAndPortUrl+"/api/v1/rides";

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

let logout = document.getElementById("logoutThisUser");
logout.onclick = function () {
    logoutUser()
};
}

loadAvailableRides();

function activateDiv(){
    let rideDivs = document.getElementsByClassName('ride_template');

    [].forEach.call(rideDivs, (mydiv) => {
        mydiv.addEventListener('click', () => {
            logResult("ride_id", mydiv.id);
            window.location.replace('request_ride.html');
        })
    });
}

