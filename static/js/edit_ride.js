import {getFromCurrentUserInfo, hostAndPortUrl, logoutUser, getTokenFromVerifyUser, loginPageUrl, getGivenRideId, rejectOrAcceptUrl} from './main.js'

let usernameDisplayArea = document.getElementById('currentLoginUsername');
usernameDisplayArea.innerText = getFromCurrentUserInfo();

let logoutThisUser = document.getElementById('logoutThisUser');
logoutThisUser.onclick = function () {
    logoutUser();
};

let form = document.getElementById('createRideForm');

/*****************************************************************/
function logResultUser(result) {
    let rideInfo = result.myData['Ride details'];
    let error = result.myData['message']; // missing or expired token

    if (error) {
        alert(error);
        window.location.replace(loginPageUrl)
    } else {
        form.origin.value = rideInfo['origin'];
        form.destination.value = rideInfo['destination'];
        form.meet_point.value = rideInfo['meet_point'];
        form.contribution.value = rideInfo['contribution'];
        form.free_spots.value = rideInfo['free_spots'];
        form.start_date.value = rideInfo['start_date'];
        form.finish_date.value = rideInfo['finish_date'];
        form.terms.value = rideInfo['terms'];
    }
  }

function readResponseAsJSONUser(response) {

        return response.json().then(json => {
          return {
                   myData: json,
                   status: response.status
                 }
        })
    }
function getUsersJSONUser(pathToResource) {
    fetch(pathToResource) // 1
    .then(readResponseAsJSONUser) // 3
    .then(logResultUser) // 4
  }

const rideDetailUrl = hostAndPortUrl+"/api/v1/rides/"+getGivenRideId();

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


/****************************************************************/

form.addEventListener('submit', function createRide(event) {
    event.preventDefault();
    let data = {
        origin: form.origin.value,
        destination: form.destination.value,
        meet_point: form.meet_point.value,
        contribution: parseFloat(form.contribution.value),
        free_spots: parseInt(form.free_spots.value, 10),
        start_date: form.start_date.value,
        finish_date: form.finish_date.value,
        terms: form.terms.value
    };

    const createRide_uri = hostAndPortUrl+"/api/v1/users/rides/"+getGivenRideId()+"/edit";
    let myHeader = new Headers({"Content-Type": "application/json",
                                "Accept": "application/json",
                                "Authorization": getTokenFromVerifyUser()});
    let option = {
        method: "PUT",
        headers: myHeader,
        body: JSON.stringify(data)
    };
    function readResponseAsJSON(response) {

        return response.json().then(json => {
          return {
                   myData: json,
                   status: response.status
                 }
        })
    }
    let createRide_req = new Request(createRide_uri, option);
    function createRideJSON(requestPath) {
        fetch(requestPath)
            .then(readResponseAsJSON)
            .then(function (response) {
                if (response.status >= 200 && response.status < 300){
                    // created ride successfully
                    alert(response.myData.message);
                    window.location.replace(rejectOrAcceptUrl)
                }else{
                    // failed to create ride
                    alert(response.myData.message);
                    console.log(typeof form.free_spots.value)
                }
            })
    }
    createRideJSON(createRide_req);
    //form.reset()
});