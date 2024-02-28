/**
 * Created by Dr.Kimpatrick on 8/2/2018.
 */

import {getFromCurrentUserInfo, hostAndPortUrl, logoutUser, loginPageUrl, manageRequests, getCancelRequestId, logResult, getTokenFromVerifyUser, profilePageDisplayRidesUrl} from './main.js'
// is displayed in the navigation bar
let usernameDisplayArea = document.getElementById('currentLoginUsername');
usernameDisplayArea.innerText = getFromCurrentUserInfo();

let logoutThisUser = document.getElementById('logoutThisUser');
logoutThisUser.onclick = function () {
    logoutUser();
};

/**************************************************************/
let rideRequestDisplayArea = document.getElementById('rideRequestDisplayArea');
function displayRideGiven(result) {
    let error = result.myData['message']; // missing or expired token
    let myRequests = result.myData["Ride_requests"];

    if (result.status === 401 || result.status === 500){
        // Token missing or internal server error
        alert(error);
        window.location.replace(loginPageUrl);

    }else if(result.status === 404){
        // no requests made to the ride yet
        alert(error);
        window.location.replace(profilePageDisplayRidesUrl)

    }else if(result.status >= 200 && result.status < 300){
        let myHTML = `<table>
                            <tr>
                                <th>No</th>
                                <th>Driver</th>
                                <th>Origin</th>
                                <th>Destination</th>
                                <th>Meet_point</th>
                                <th>Start date</th>
                                <th>Finish date</th>
                                <th>Action</th>
                                <th>Status</th>
                            </tr>`;
        let num = 0;
        for (let index in myRequests){
            let data = myRequests[index];
            let request_status = data['request_status'];

            num++;
            myHTML +=  `<tr>
                            <td>${num}</td>
                            <td>${data['username']}</td>
                            <td>${data['origin']}</td>
                            <td>${data['destination']}</td>
                            <td>${data['meet_point']}</td>
                            <td>${data['start_date']}</td>
                            <td>${data['finish_date']}</td>
                            <td><span><button class="danger cancel_request" id=${data['request_id']}>Cancel Request</button></span></td>
                       
                        `;
            let request_status_buttons = '';
            if (request_status === 'accepted'){
                //
                request_status_buttons += `<td>
                                    <span><button class="success">Accepted</button></span>
             
                                </td>
                            </tr>`;
            }else if(request_status === 'rejected'){
                //
                request_status_buttons += `<td>
                                    <span><button class="danger">Rejected</button></span
                               
                            </tr>`;
            }else {
                //
                request_status_buttons += `<td>
                                
                                    <span><button class="default-cancel">Pending</button></span>
                               
                            </tr>`;
            }
            myHTML += request_status_buttons

        }
        myHTML += '</table>';
        rideRequestDisplayArea.innerHTML = myHTML;

    }
    activateCancelButton()
  }


function readRideResponseAsJSON(response) {
    return response.json().then(json => {
          return {
                   myData: json,
                   status: response.status
                 }
        })
  }

function fetchRideGivenJSON(pathToResource) {
    fetch(pathToResource) // 1
    .then(readRideResponseAsJSON) // 3
    .then(displayRideGiven) // 4
  }

const requestsUrl = hostAndPortUrl+"/api/v1/user/requests";

let requests_header = new Headers({"Content-Type": "application/json",
                          "Authorization": getTokenFromVerifyUser()});

// new Request(uri, option);
let option = {
    method: "GET",
    //credentials: "same-origin",
    headers: requests_header
};

let requests_req = new Request(requestsUrl, option);

fetchRideGivenJSON(requests_req);


/**************** Delete request *****************************/

function logCancelRequest(result) {
    let messageResult = result.myData['message']; // missing or expired token

    if (result.status === 401 || result.status === 500){
        // Token missing or internal server error
        alert(messageResult);
        window.location.replace(loginPageUrl);

    } else{
        // success
        alert(messageResult);
        window.location.replace(manageRequests)
    }
}

function readCancelRequestResponseAsJSON(response) {
    return response.json().then(json => {
          return {
                   myData: json,
                   status: response.status
                 }
        })
  }

function fetchCancelRequestJSON(pathToResource) {
    fetch(pathToResource) // 1
    .then(readCancelRequestResponseAsJSON) // 3
    .then(logCancelRequest) // 4
  }


function activateCancelButton(){

    let cancel_req_header = new Headers({"Content-Type": "application/json",
                              "Authorization": getTokenFromVerifyUser()});

    // new Request(uri, option);
    let option_req = {
        method: "DELETE",
        headers: cancel_req_header
    };



    let rideDivs = document.getElementsByClassName('cancel_request');
    [].forEach.call(rideDivs, (mydiv) => {
        mydiv.addEventListener('click', () => {
            logResult("cancel_request_id", mydiv.id);
            console.log(mydiv.id);
            console.log(getCancelRequestId());
            // window.location.replace('request_ride.html');
            let r = confirm("Confirm Cancellation of request\n Click Cancel to ignore");
            if (r == true) {
                const cancelRequestsUrl = hostAndPortUrl+"/api/v1/rides/"+getCancelRequestId()+"/requests/cancel";
                let requests_req = new Request(cancelRequestsUrl, option_req);
                fetchCancelRequestJSON(requests_req)
            }
        })
    });
}