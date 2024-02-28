/**
 * Created by Dr.Kimpatrick on 7/27/2018.
 */
//logoutUser, loginPageUrl, getFromCurrentUserInfo, getTokenFromVerifyUser, getUserInfo, saveToCurrentUserInfo
import {getTokenFromVerifyUser, hostAndPortUrl, logoutUser, getFromCurrentUserInfo, getRideId, loginPageUrl} from './main.js'

export function requestRide(ride_id) {

let toContainRideDetails = document.getElementById("rideDetailContent");
let loginUsernameDisplayArea = document.getElementById("currentLoginUsername");

function logResultUser(result) {
    let rideInfo = result['Ride details'];
    let error = result['message']; // missing or expired token

    if (error) {
        window.location.replace(loginPageUrl)
    } else {
        loginUsernameDisplayArea.innerText = getFromCurrentUserInfo();
        let myHTML = '';
        myHTML += ` 
            <table> 
                <tr> 
                    <th>Driver (username)</th> 
                    <td>${rideInfo['Driver details']['username']}</td> 
                </tr> 
                <tr> 
                    <th>Origin</th> 
                    <td>${rideInfo['origin']}</td> 
                </tr>
                <tr> 
                    <th>Destination</th> 
                    <td>${rideInfo['destination']}</td> 
                </tr> 
                <tr> 
                    <th>Meetpoint</th> 
                    <td>${rideInfo['meet_point']}</td> 
                </tr> 
                <tr> 
                    <th>Contribution</th> 
                    <td>${rideInfo['contribution']}</td> 
                </tr> 
                <tr> 
                    <th>NumFreeSpots</th> 
                    <td>${rideInfo['free_spots']}</td> 
                </tr> 
                <tr> 
                    <th>Start date</th> 
                    <td>${rideInfo['start_date']}</td> 
                </tr> 
                <tr> 
                    <th>Finish date</th> 
                    <td>${rideInfo['finish_date']}</td> 
                </tr> 
            </table> `;

        toContainRideDetails.innerHTML = myHTML;
        //document.getElementById('driverName').innerText = rideInfo['Driver details']['name'];
        document.getElementById('driverEmail').innerText = rideInfo['Driver details']['email'];
        document.getElementById('driverMobile').innerText = rideInfo['Driver details']['phone_number'];
        document.getElementById('driverGender').innerText = rideInfo['Driver details']['gender']
        }
  }


function readResponseAsJSONUser(response) {
    return response.json();
  }

function getUsersJSONUser(pathToResource) {
    fetch(pathToResource) // 1
    .then(readResponseAsJSONUser) // 3
    .then(logResultUser) // 4
  }

const rideDetailUrl = hostAndPortUrl+"/api/v1/rides/"+ride_id;

let user_h = new Headers({"Content-Type": "application/json",
                          "Authorization": getTokenFromVerifyUser()});

// new Request(uri, option);
let option = {
    method: "GET",
    credentials: "same-origin",
    headers: user_h
};

let rides_req = new Request(rideDetailUrl, option);

getUsersJSONUser(rides_req);
}

requestRide(getRideId());

let logout = document.getElementById("logoutThisUser");
logout.onclick = function () {
    logoutUser()
};



