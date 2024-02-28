/**
 * Created by Dr.Kimpatrick on 8/1/2018.
 */


/***************************************************************/
export function getRequestsToThisRide(ride_id) {



    function displayRideRequests(result) {
        let rideRequests = result['Ride requests'];
        let error = result['message']; // missing or expired token
        console.log(result['Ride requests']);
        console.log(error);
        if (error) {
            window.location.replace(loginPageUrl)
        } else {
            let myHTML = `<table>
                            <tr>
                                <th>No</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Action</th>
                            </tr>`;
            //let myHTML = '';
            for (let index in rideRequests){
                let requestsDict = rideRequests[index];

                myHTML += `<tr>
                                <td>2</td>
                                <td>${requestsDict["passenger details"]['username']}</td>
                                <td>${requestsDict["passenger details"]['email']}</td>
                                <td>${requestsDict["passenger details"]['phone number']}</td>
                                <td>
                                    <span><button class="success">Accepted</button></span>
                                </td>
                            </tr>`;
            }

            //toWrapRideRequests.innerHTML = '<b>Name</b>';
            let toWrapRideRequests = document.getElementById("action_area_requests");
            toWrapRideRequests.innerHTML = myHTML + '</table>';
            console.log(myHTML)
            }
      }


    function readResponseAsJSONRequests(response) {
        return response.json();
      }

    function getRideRequestsJSON(pathToResource) {
        fetch(pathToResource) // 1
        .then(readResponseAsJSONRequests) // 3
        .then(displayRideRequests) // 4
      }

    const requestsUrl = "http://127.0.0.1:5000/api/v1/users/rides/" +ride_id+"/requests";

    let requests_header = new Headers({"Content-Type": "application/json",
                              "Authorization": getTokenFromVerifyUser()});

    // new Request(uri, option);
    let option = {
        method: "GET",
        //credentials: "same-origin",
        headers: requests_header,
        mode: "no-cors"
    };

    let rides_req = new Request(requestsUrl, option);

    getRideRequestsJSON(rides_req);
}

//getRequestsToThisRide(getGivenRideId());

