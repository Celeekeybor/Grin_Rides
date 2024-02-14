/**
 * Created by Dr.Kimpatrick on 8/1/2018.
 */

import {rejectOrAcceptUrl, hostAndPortUrl, getRejectRequestId ,getRejectedRequestId ,getAcceptedRequestId, getAcceptRequestId, getFromCurrentUserInfo, logoutUser, loginPageUrl, logResult, getTokenFromVerifyUser, getGivenRideId, profilePageDisplayRidesUrl} from './main.js'

// is displayed in the navigation bar
let usernameDisplayArea = document.getElementById('currentLoginUsername');
usernameDisplayArea.innerText = getFromCurrentUserInfo();

let logoutThisUser = document.getElementById('logoutThisUser');
logoutThisUser.onclick = function () {
    logoutUser();
};


let toContainRideDetails = document.getElementById("rideDetailContent");
let actionAreaRequests = document.getElementById('action_area_requests');


function displayRideGiven(result) {
    let rideInfo = result['Ride details'];
    let error = result['message']; // missing or expired token

    if (error) {
        window.location.replace(loginPageUrl)
    } else {
        let myHTML = '';
        myHTML += ` 
            <table style="background-color: silver; border-radius: 4px;"> 
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
        }
        //
        const rides_requests_uri = hostAndPortUrl+"/api/v1/users/rides/"+getGivenRideId()+"/requests";

        let request_header = new Headers({"Content-Type": "application/json",
                                  "Authorization": getTokenFromVerifyUser()});

        // new Request(uri, option);
        let option_request = {
            method: "GET",
            //credentials: "same-origin",
            headers: request_header
        };

        let request_req = new Request(rides_requests_uri, option_request);

        fetchRideRequestsJSON(request_req);
  }


function readRideResponseAsJSON(response) {
    return response.json();
  }

function fetchRideGivenJSON(pathToResource) {
    fetch(pathToResource) // 1
    .then(readRideResponseAsJSON) // 3
    .then(displayRideGiven) // 4
  }

const rideDetailUrl = hostAndPortUrl+"/api/v1/rides/"+getGivenRideId();

let user_h = new Headers({"Content-Type": "application/json",
                          "Authorization": getTokenFromVerifyUser()});

// new Request(uri, option);
let option = {
    method: "GET",
    //credentials: "same-origin",
    headers: user_h
};

let rides_req = new Request(rideDetailUrl, option);

fetchRideGivenJSON(rides_req);


/*****************************************************************************/
function displayRideRequests(result) {
    //console.log(result);
    let error = result.myData['message']; // missing or expired token
    let rides = result.myData["Ride_requests"];

    if (result.status === 401 || result.status === 500){
        // Token missing or internal server error
        alert(error);
        window.location.replace(loginPageUrl);

    }else if(result.status === 404){
        // no requests made to the ride yet
        alert(error);

    }else if(result.status >= 200 && result.status < 300){

        let myHTML = `<table>
                            <tr>
                                <th>No</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Action</th>
                            </tr>`;
        let num = 0;
        for(let index in rides) {
            let dict = rides[index];
            let passengerInfo = dict['passenger_details'];
            let request_status = dict['request_status'];
            let request_id = dict['request_id'];

            // generate number
            num++;

            myHTML += `<tr>
                        <td>${num}</td>
                        <td>${passengerInfo['username']}</td>
                        <td>${passengerInfo['email']}</td>
                        <td>${passengerInfo['phone_number']}</td>
                        `;
            let request_status_buttons = '';
            if (request_status === 'accepted'){
                //
                request_status_buttons += `<td>
                                    <span><button class="success">Accepted</button></span>
                                    <span><button class="default-cancel accepted_request" id=${request_id} >Cancel</button></span>
                                </td>
                            </tr>`;
            }else if(request_status === 'rejected'){
                //
                request_status_buttons += `<td>
                                    <span><button class="danger">Rejected</button></span>
                                    <span><button class="default-cancel rejected_request" id=${request_id}>Cancel</button></span>
                                </td>
                            </tr>`;
            }else {
                //
                request_status_buttons += `<td>
                                    <span><button class="success accept_request" id=${request_id}>Accept</button></span>
                                    <span><button class="danger reject_request" id=${request_id}>Reject</button></span>
                                </td>
                            </tr>`;
            }
            myHTML += request_status_buttons
        }
        myHTML += '</table>';
        actionAreaRequests.innerHTML = myHTML;

    }
    activateReactToRequest('accepted_request');
    activateReactToRequest('rejected_request');
    activateReactToRequest('accept_request');
    activateReactToRequest('reject_request');
}

function readRidesRequestResponseAsJSON(response) {

        return response.json().then(json => {
          return {
                   myData: json,
                   status: response.status
                 }
        })
    }
function fetchRideRequestsJSON(pathToResource) {
    fetch(pathToResource)
    .then(readRidesRequestResponseAsJSON)
    .then(displayRideRequests)
  }


/*************** Delete ride offer *****************************/

let deleteRideButton = document.getElementById("deleteRide");
deleteRideButton.addEventListener('click', function () {
    function logResultDisplayMessage(result) {

        let error = result.myData['message'];
        let success_message = result.myData['message'];
        if(result.status === 401 || result.status === 500){
        // Token missing or internal server error
        alert(error);
        window.location.replace(loginPageUrl);

        }else{
            // ride is deleted
            alert(success_message);
            window.location.replace(profilePageDisplayRidesUrl)

        }
    }
    function readDeleteRideResponseAsJSON(response) {

        return response.json().then(json => {
          return {
                   myData: json,
                   status: response.status
                 }
        })
        }
    function fetchDeleteRideJSON(pathToResource) {
        fetch(pathToResource)
        .then(readDeleteRideResponseAsJSON)
        .then(logResultDisplayMessage)
      }

    const rideDetailUrl = hostAndPortUrl+"/api/v1/users/rides/"+getGivenRideId()+"/delete";

    let user_h = new Headers({"Content-Type": "application/json",
                              "Authorization": getTokenFromVerifyUser()});

    // new Request(uri, option);
    let option = {
        method: "DELETE",
        //credentials: "same-origin",
        headers: user_h
    };

    let delete_ride_req = new Request(rideDetailUrl, option);

    // Invoke a window to confirm delete
    let r = confirm("Confirm delete!\nThe delete action is irreversible.\nPress Cancel to ignore.");
    if (r == true) {
        fetchDeleteRideJSON(delete_ride_req)
    }

});


/**************Accept or Reject request *************/

function logResultReactToRideRequest(result) {

    let error = result.myData['message'];
    let success_message = result.myData['message'];
    if(result.status === 401 || result.status === 500){
    // Token missing or internal server error
    alert(error);
    window.location.replace(loginPageUrl);

    }else{
        // ride is deleted
        alert(success_message);
        window.location.replace(rejectOrAcceptUrl)

    }
}
function readRideReqResponseAsJSON(response) {

    return response.json().then(json => {
      return {
               myData: json,
               status: response.status
             }
    })
    }
function fetchReactToRequestJSON(pathToResource) {
    fetch(pathToResource)
    .then(readRideReqResponseAsJSON)
    .then(logResultReactToRideRequest)
  }


function activateReactToRequest(requestClass){
    let rideDivs = document.getElementsByClassName(requestClass);

    let req_reaction_header = new Headers({"Content-Type": "application/json",
                              "Authorization": getTokenFromVerifyUser()});

    // new Request(uri, option);



    [].forEach.call(rideDivs, (mydiv) => {
        mydiv.addEventListener('click', () => {
            logResult(requestClass, mydiv.id);
            //window.location.replace(acceptedRideUrl);
            if (requestClass === 'accepted_request'){
                //
                let r = confirm("Confirm Change \n The request status will return to default");
                    if (r == true) {
                        let reactionData = {reaction: ""};
                        reactionData.reaction = 'pending';
                        let option_req_reaction = {
                            method: "PUT",
                            headers: req_reaction_header,
                            body: JSON.stringify(reactionData)
                        };

                        const RequestReaction_Url = hostAndPortUrl+"/api/v1/users/rides/"+getAcceptedRequestId()+"/reaction";
                        let req_reaction_req = new Request(RequestReaction_Url, option_req_reaction);
                        fetchReactToRequestJSON(req_reaction_req)
                    }
            }else if(requestClass === 'rejected_request'){
                //
                let r = confirm("Confirm Change \n The request status will return to default");
                    if (r == true) {
                        let reactionData = {reaction: ""};
                        reactionData.reaction = 'pending';
                        let option_req_reaction = {
                            method: "PUT",
                            headers: req_reaction_header,
                            body: JSON.stringify(reactionData)
                        };
                        const RequestReaction_Url = hostAndPortUrl+"/api/v1/users/rides/"+getRejectedRequestId()+"/reaction";
                        let req_reaction_req = new Request(RequestReaction_Url, option_req_reaction);
                        fetchReactToRequestJSON(req_reaction_req)
                    }
            }else if(requestClass === 'accept_request'){
                //
                let r = confirm("Confirm Accept request\n Request status will turn to accepted");
                    if (r == true) {
                        let reactionData = {reaction: ""};
                        reactionData.reaction = 'accept';
                        let option_req_reaction = {
                            method: "PUT",
                            headers: req_reaction_header,
                            body: JSON.stringify(reactionData)
                        };
                        const RequestReaction_Url = hostAndPortUrl+"/api/v1/users/rides/"+getAcceptRequestId()+"/reaction";
                        let req_reaction_req = new Request(RequestReaction_Url, option_req_reaction);
                        fetchReactToRequestJSON(req_reaction_req)
                    }
            }else {
                // reject_request
                let r = confirm("Confirm Reject request\n Request status will turn to rejected");
                    if (r == true) {
                        let reactionData = {reaction: ""};
                        reactionData.reaction = 'reject';
                        let option_req_reaction = {
                            method: "PUT",
                            headers: req_reaction_header,
                            body: JSON.stringify(reactionData)
                        };
                        const RequestReaction_Url = hostAndPortUrl+"/api/v1/users/rides/"+getRejectRequestId()+"/reaction";
                        let req_reaction_req = new Request(RequestReaction_Url, option_req_reaction);
                        fetchReactToRequestJSON(req_reaction_req)
                    }
            }


            //alert(requestClass+" "+mydiv.id)
        })
    });
}


