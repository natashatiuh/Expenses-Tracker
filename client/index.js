const userNameInput = document.getElementById("userName")
const passwordInput = document.getElementById("password")

const logInButton = document.getElementById("log-in-button")

logInButton.addEventListener("click", async () => {
    console.log(JSON.stringify({
        userName: userNameInput.value,
        password: passwordInput.value
    }))

    try {
        const response = await fetch("http://localhost:3001/authorization", {
            method: 'POST',
            headers: {
                'Content-Type' : "application/json",
            },
                body: JSON.stringify({
                    userName: userNameInput.value,
                    password: passwordInput.value
                })
            })

            const data = await response.json()
            console.log(data)
            alert('User was authorized!')
     } catch (error) {
        console.log(error)
        alert("ERROR! User wasn't authorized!")
     }
})