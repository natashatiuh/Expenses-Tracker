const addSubscription = document.getElementById("add-subscription")

const token = window.localStorage.getItem("token");

addSubscription.addEventListener("click", async () => {
    try {
        const response = await fetch("http://localhost:3001/subscriptions/add-subscription", {
            method: "PATCH",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            }
        })
        const data = await response.json()
        if (token) {
            alert("Your subscription was activated!")
            window.location.replace("file:///Users/nataliatuh/Documents/natasha-projects/expenses_tracker/client/subscription-info.html"); 
        } else {
            alert("Try one more time!")
        }
    } catch (error) {
        console.log(error)
        alert("ERROR. Problem with adding subscription.")
    }
})



