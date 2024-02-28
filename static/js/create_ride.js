import {getFromCurrentUserInfo, hostAndPortUrl, logoutUser, getTokenFromVerifyUser} from './main.js'

let usernameDisplayArea = document.getElementById('currentLoginUsername');
usernameDisplayArea.innerText = getFromCurrentUserInfo();

let logoutThisUser = document.getElementById('logoutThisUser');
logoutThisUser.onclick = function () {
    logoutUser();
};

let form = document.getElementById('createRideForm');
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

    const createRide_uri = hostAndPortUrl+'/api/v1/users/rides';
    let myHeader = new Headers({"Content-Type": "application/json",
                                "Accept": "application/json",
                                "Authorization": getTokenFromVerifyUser()});
    let option = {
        method: "POST",
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
                    window.location.replace('profile_page_rides_given_and_taken.html')
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