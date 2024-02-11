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
        `<a id="no-subscription" href="file:///Users/nataliatuh/Documents/natasha-projects/expenses_tracker/client/subscription-new.html">Try our premium here!</a>`
        )
    } else {
        userInfo.insertAdjacentHTML('beforeend', 
        `<a id="has-subscription" href="file:///Users/nataliatuh/Documents/natasha-projects/expenses_tracker/client/subscription-info.html">Check your subscription info here!</a>`
        )
    }
}


let newNameInput = document.getElementById("new-name-input")
const newNameButton = document.getElementById("new-name-button")

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
        if (data.success == true) {
            alert("Username was updated!")
            const usernameInfo = document.getElementById("username")
            usernameInfo.innerHTML = `<b>Username:</b> ${newNameInput.value}`;  
            newNameInput.value = ""
        } else {
            alert("The user with such name is already exists. Choose another username.")
        }
        
    } catch (error) {
        console.log(error)
        alert('Error editing Username. Please try again.')
    }
})
getUserInfo()

let newCountryInput = document.getElementById("new-country-input")
const newCountryButton = document.getElementById("new-country-button")

newCountryButton.addEventListener("click", async () => {
    console.log(JSON.stringify({
        newCountry: newCountryInput.value
    }))
    try {
        const response = await fetch("http://localhost:3001/authorization/country", {
            method: "PATCH",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                newCountry: newCountryInput.value
            })
        })

        const data = await response.json()
        console.log(data)
        alert("Country and Currency was updated!")
        const countryInfo = document.getElementById("country")
        countryInfo.innerHTML = `<b>Country:</b> ${newCountryInput.value}`
        newCountryInput.value = ""

        const currencyResponse = await fetch("http://localhost:3001/authorization/currency", {
            method: "GET",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            }
        })

        const currencyData = await currencyResponse.json()
        const currency = currencyData.currency[0].currency 
        console.log(currency)
        const currencyInfo = document.getElementById("currency")
        currencyInfo.innerHTML = `<b>Currency:</b> ${currency}`

    } catch (error) {
        console.log(error)
        alert('Error editing Country. Please try again.')
    }
})

let oldPasswordInput = document.getElementById("old-password-input")
let newPasswordInput = document.getElementById("new-password-input")
const changePasswordButton = document.getElementById("change-password-button")

changePasswordButton.addEventListener("click", async () => {
    console.log(JSON.stringify({
        oldPassword: oldPasswordInput.value,
        newPassword: newPasswordInput.value
    }))

    const userInfoResponse = await fetch("http://localhost:3001/authorization/user", {
        method: "GET",
        headers: {
            'Authorization': token
        }
    })

    const userInfoData = await userInfoResponse.json()
    const userPassword = userInfoData.user.password

    try {
        const response = await fetch("http://localhost:3001/authorization/password", {
            method: "PATCH",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                oldPassword: oldPasswordInput.value,
                newPassword: newPasswordInput.value
            })
        })

        const data = await response.json()
        console.log(data)
        if (userPassword == oldPasswordInput.value) {
            alert("Your password was changed!")
            oldPasswordInput.value = ""
            newPasswordInput.value = ""
        } else {
            alert("Your old password is incorrect!")
        }
        
    } catch (error) {
        console.log(error)
        alert("Error editing Password. Please try again.")
    }
})

const myCategoriesButton = document.getElementById("categories-button")

myCategoriesButton.addEventListener("click", () => {
    window.location.replace("file:///Users/nataliatuh/Documents/natasha-projects/expenses_tracker/client/categories.html")
})

const signOutButton = document.getElementById("sign-out")

signOutButton.addEventListener("click", () => {
    window.location.replace("file:///Users/nataliatuh/Documents/natasha-projects/expenses_tracker/client/index.html")
})

const myExpensesButton = document.getElementById("expenses-button")

myExpensesButton.addEventListener("click", () => {
    window.location.replace("file:///Users/nataliatuh/Documents/natasha-projects/expenses_tracker/client/expenses.html")
})

