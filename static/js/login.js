/**
 * Created by Dr.Kimpatrick on 7/25/2018.
 */

import {getUserInfo, logResult, availableRidesUrl, hostAndPortUrl} from './main.js';


/************ Login alone ****************************/

let form = document.getElementById("signInForm");

// hide by default| padding makes it visible
let loginErrorArea = document.getElementById("loginError");
//loginErrorArea.style.display = 'none';


function readResponseAsJSON(response) {
    return response.json();
}

function fetchJSON(pathToResource) {
    fetch(pathToResource) // 1
    .then(readResponseAsJSON) // 2
    .then((data) => {
        if(data.Token){
            logResult("Token", data.Token); // setting token

            // specify the url to the page you want to go
            getUserInfo(availableRidesUrl); // setting username
            //window.location.replace(availableRidesUrl)
        }else{
            loginErrorArea.innerText = data.message;
            loginErrorArea.style.display = 'block';
        }

    })
}


form.addEventListener('submit', function getInfo(event){
    event.preventDefault();

    // Login with username or email
    let data = {
    password: form.password.value
    };

    let userInput = form.username_or_email.value,
    at = "@",
    dot = ".";

    if (userInput.includes(at) && userInput.includes(dot)){
        data['email'] = form.username_or_email.value
    }else {
        data['username'] = form.username_or_email.value
    }


    const login_uri = hostAndPortUrl+"/api/v1/auth/login";

    let h = new Headers({"Content-Type": "application/json", "Accept": "application/json"});

    // new Request(uri, option);
    let option = {
        method: "POST",
        //credentials: "same-origin",
        headers: h,
        body: JSON.stringify(data)
    };
    let req = new Request(login_uri, option);
    fetchJSON(req);
    form.reset();
});

