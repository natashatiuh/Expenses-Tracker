const myProfileButton = document.getElementById("profile-button")

const profileModal = document.getElementById("my-profile-modal")

const profileModalInfo = document.getElementById("modal-content-profile")

const closeProfileButton = document.getElementsByClassName("close-profile") [0]

const userInfo = document.getElementById("user-info")

myProfileButton.addEventListener("click", () => {
    profileModal.style.display = "block"
})

closeProfileButton.addEventListener("click", () => {
    profileModal.style.display = "none"
})

window.addEventListener("click", (event) => {
    if (event.target == profileModal) {
        profileModal.style.display = "none"
    }
})

const token = window.localStorage.getItem("token");

async function getUserInfo() {
    const response = await fetch("http://localhost:3001/authorization/user", {
        method: "GET",
        headers: {
            'Authorization': token
        }
    })
    const userObject = await response.json()
    const user = userObject.user
    console.log(user.userName)
    userInfo.insertAdjacentHTML('beforeend', 
    `<p id="username"><b>Username:</b> ${user.userName}</p>
     <p id="country"><b>Country:</b> ${user.country}</p>
     <p id="currency"><b>Currency:</b> ${user.currency}</p>`
    )

    if (user.subscriptionExpiresAt == null) {
        userInfo.insertAdjacentHTML('beforeend', 
        `<a href="url">Try our premium here!</a>`
        )
    } else {
        userInfo.insertAdjacentHTML('beforeend', 
        `<p>Your subscription expires at ${user.subscriptionExpiresAt}.</p>`
        )
    }
}


let newNameInput = document.getElementById("new-name-input")
const newNameButton = document.getElementById("new-name-button")

const usernameInfo = document.getElementById("username")

let newCountryInput = document.getElementById("new-country-input")
const newCountryButton = document.getElementById("new-country-button")

let oldPasswordInput = document.getElementById("old-password-input")
let newPasswordInput = document.getElementById("new-password-input")
const newPasswordButton = document.getElementById("new-password-button")

newNameButton.addEventListener("click", async () => {
    console.log(JSON.stringify({
        newName: newNameInput.value
    }))
    try {
        const response = await fetch("http://localhost:3001/authorization/name", {
            method: "PATCH",
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                newName: newNameInput.value
            }),
        })
        
        const data = await response.json()
        console.log(data)
        alert("Username was updated!")
        newNameInput.value = ""
    } catch (error) {
        console.log(error)
        alert('Error editing Username. Please try again.')
    }
})
getUserInfo()