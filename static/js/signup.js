import {loginPageUrl, hostAndPortUrl} from './main.js'

let signupErrorArea = document.getElementById('signupErrorArea');
//signupErrorArea.style.display = 'none';

let form = document.getElementById('signupForm');
form.addEventListener('submit', function signup(event) {
    event.preventDefault();
    let data = {
        username: form.username.value,
        email: form.email.value,
        phone_number: form.phone_number.value,
        password: form.password.value,
        name: "",
        gender: "",
        bio: ""
    };
    let myHeader = new Headers({"Content-Type": "application/json", "Accept": "application/json"});
    const signup_api_url = hostAndPortUrl+'/api/v1/auth/signup';
    let option = {
        headers: myHeader,
        method: "POST",
        body: JSON.stringify(data)
    };
    let signup_req = new Request(signup_api_url, option);
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
                    // signup success
                    alert(response.myData.message);
                    window.location.replace(loginPageUrl);

                }else {
                    // signup failure
                    signupErrorArea.innerText = response.myData.message;
                    signupErrorArea.style.display = 'block';
                }
            })
    }
    signupJSON(signup_req);
    form.reset()
});