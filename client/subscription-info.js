const token = window.localStorage.getItem("token");

async function getExpirationDate() {
    const expirationDateResponse = await fetch("http://localhost:3001/authorization/user", {
        method: "GET",
        headers: {
            'Authorization': token
        }
    })

    const userInfoData = await expirationDateResponse.json()
    const expirationDate = userInfoData.user.subscriptionExpiresAt


    const expiration = document.getElementById("expiration")

    expiration.insertAdjacentHTML('beforeend',
    `<h4><b>Your subscription expires at:</b> ${expirationDate}</h4>`
    )
}

getExpirationDate()

const cancelSubscriptionButton = document.getElementById("cancel-subscription")

cancelSubscriptionButton.addEventListener("click", async () => {
    try {
       const response = await fetch("http://localhost:3001/subscriptions/stop-subscription", {
        method: "PATCH",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        }
    })
        const data = await response.json()
        if (token) {
            alert("Your subscription was cancelled!")
            window.location.replace("file:///Users/nataliatuh/Documents/natasha-projects/expenses_tracker/client/home.html"); 
        } else {
            alert("Try one more time!")
        }  
    } catch (error) {
        console.log(error)
        alert("ERROR. Subscription wasn't cancelled!")
    }
    
})
