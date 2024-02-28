/**
 * Created by Dr.Kimpatrick on 8/1/2018.
 */
import {getFromCurrentUserInfo, hostAndPortUrl, logoutUser, getUserInfo, loginPageUrl, profilePageDisplayRidesUrl, getTokenFromVerifyUser} from './main.js'

let loginUsernameDisplayArea = document.getElementById("currentLoginUsername");
loginUsernameDisplayArea.innerText = getFromCurrentUserInfo();

let logout = document.getElementById("logoutThisUser");
logout.onclick = function () {
    logoutUser()
};

let form = document.getElementById('profileForm');
function logResultUser(result) {
    let userInfo = result['User_info'];
    let error = result['message']; // missing or expired token

    if (error) {
        window.location.replace(loginPageUrl)
    } else {
            form.Name.value = userInfo['name'];
            form.username.value = userInfo['username'];
            form.email.value = userInfo['email'];
            form.bio.value = userInfo['bio'];
            form.phone_number.value = userInfo['phone_number'];
            form.gender.value = userInfo['gender'];

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

const rideDetailUrl = hostAndPortUrl+"/api/v1/current/user/info";

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

form.addEventListener('submit', function signup(event) {
    event.preventDefault();
    let data = {
        username: form.username.value,
        email: form.email.value,
        phone_number: form.phone_number.value,
        gender: form.gender.value,
        bio: form.bio.value,
        name: form.Name.value
    };
    let myHeader = new Headers({"Content-Type": "application/json", "Accept": "application/json", "Authorization": getTokenFromVerifyUser()});
    const update_profile_api_url = hostAndPortUrl+'/api/v1/auth/edit/profile';
    let option = {
        headers: myHeader,
        method: "PUT",
        body: JSON.stringify(data)
    };
    let signup_req = new Request(update_profile_api_url, option);
    function readResponseAsJSON(response) {

        return response.json().then(json => {
          return {
                   myData: json,
                   status: response.status
                 }
        })
    }
    function signupJSON(requestPath) {
        fetch(requestPath)
            .then(readResponseAsJSON)
            .then(function (response) {
                if(response.status >= 200 && response.status < 300){
                    // update the cookies for userInfo
                    // also redirect to the profile page that has rides
                    alert(response.myData.message);
                    getUserInfo(profilePageDisplayRidesUrl);

                }else {
                    // signup failure
                    alert(response.myData.message);
                }
            })
    }
    signupJSON(signup_req);
});
