const signUpModal = document.getElementById("signup-modal")

const signUpButton = document.getElementById("sign-up")

const spanSignUp = document.getElementsByClassName("close-signup")[0]

signUpButton.addEventListener("click", () => {
    signUpModal.style.display = "block"
})

spanSignUp.addEventListener("click", () => {
    signUpModal.style.display = "none"
})

window.addEventListener("click", (event) => {
    if (event.target == signUpModal) {
        signUpModal.style.display = "none"
    }
})

let userNameInputSignUp = document.getElementById("signup-username")
let countryInputSignUp = document.getElementById("signup-country")
let passwordInputdSignUp1 = document.getElementById("signup-password")
let passwordInputdSignUp2 = document.getElementById("signup-password2")

const signUpModalButton = document.getElementById("signup-button")

signUpModalButton.addEventListener("click", async () => {
    console.log(JSON.stringify({
        userName: userNameInputSignUp.value,
        country: countryInputSignUp.value,
        password: passwordInputdSignUp1.value
    }))

    try {
        if (passwordInputdSignUp1.value === passwordInputdSignUp2.value) {
        const response = await fetch("http://localhost:3001/authorization/sign-up", {
            method: 'POST',
            headers: {
                'Content-Type' : "application/json",
            },
            body: JSON.stringify({
                userName: userNameInputSignUp.value,
                country: countryInputSignUp.value,
                password: passwordInputdSignUp1.value
            })
        }) 
            const data = await response.json()
            window.localStorage.setItem('token', data.token)
            console.log(data)
            alert("User was authorized!")
            signUpModal.style.display = "none"
            userNameInputSignUp.value = ""
            countryInputSignUp.value = ""
            passwordInputdSignUp1.value = ""
            passwordInputdSignUp2.value = ""
            window.location.replace("file:///Users/nataliatuh/Documents/natasha-projects/expenses_tracker/client/home.html");
        } else {
            alert("Check your password!")
        }
    } catch (error) {
        console.log(error)
        alert("ERROR! User wasn't authorized!")
    }
})

const signInButton = document.getElementById("sign-in")

const signInModal = document.getElementById("signin-modal")

const spanSignIn = document.getElementsByClassName("close-signin")[0]

signInButton.addEventListener("click", () => {
    signInModal.style.display = "block"
})

spanSignIn.addEventListener("click", () => {
    signInModal.style.display = "none"
})

window.addEventListener("click", (event) => {
    if (event.target == signInModal) {
        signInModal.style.display = "none"
    }
})

let userNameInputSignIn = document.getElementById("signin-username")
let passwordInputSignIn = document.getElementById("signin-password")

const signInButtonModal = document.getElementById("signin-button")

signInButtonModal.addEventListener("click", async () => {
    console.log(JSON.stringify({
        userName: userNameInputSignIn.value,
        password: passwordInputSignIn.value
    }))

    try {
        const response = await fetch("http://localhost:3001/authorization/sign-in", {
            method: 'POST',
            headers: {
                'Content-Type' : "application/json",
            },
                body: JSON.stringify({
                    userName: userNameInputSignIn.value,
                    password: passwordInputSignIn.value
                })
            })


            const data = await response.json()
            window.localStorage.setItem('token', data.token);
            if (data.token) {
                alert('User was authorized!')
                signInModal.style.display = "none"
                userNameInputSignIn.value = ""
                passwordInputSignIn.value = ""
                window.location.replace("file:///Users/nataliatuh/Documents/natasha-projects/expenses_tracker/client/home.html"); 
            } else {
                alert("Username or password is incorrect. Try again!")
            }
            
            
     } catch (error) {
        console.log(error)
        alert("ERROR! User wasn't authorized!")
     }
})