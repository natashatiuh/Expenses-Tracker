const token = window.localStorage.getItem("token");

const categoriesTable = document.getElementById("categories-table")

const addCategoryInput = document.getElementById("add-category-input")

async function getAllCategories() {
    try {
        const userResponse = await fetch("http://localhost:3001/authorization/user", {
            method: "GET",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            }
        })
        const userData = await userResponse.json()
        const userSubscription = userData.user.subscriptionExpiresAt
        console.log(userSubscription)


        const response = await fetch("http://localhost:3001/categories", {
        method: "GET",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        }
        })

        const categoriesData = await response.json()
        
        categoriesTable.innerHTML = ''

        const categories = categoriesData.userCategories
        if (userSubscription == null) {
            categories.forEach((category) => {
            categoriesTable.insertAdjacentHTML("beforeend", `
            <tr>
                <td>${category.name}</td>
                <td>
                    <button data-category-id="${category.id}" class="add-subscription">Add Subscription</button>
                </td>
                <td>
                    <p>${userData.user.currency}</p>
                </td>
                <td>
                    <button class="edit-button">Edit</button>
                </td>
                <td>
                    <button class="delete-button">Delete</button>
                </td>
            </tr>
            `)
        })
        } else {
            categories.forEach((category) => {
                categoriesTable.insertAdjacentHTML("beforeend", `
                <tr>
                    <td>${category.name}</td>
                    ${
                        category.monthBudget == null
                            ? `<td>
                                <button 
                                    data-category-id="${category.id}"
                                    class="add-budget-button"
                                >Add Budget</button>
                            </td>`
                            : `<td>${category.monthBudget}</td>`
                    }
                            <td>
                            <p>${userData.user.currency}</p>
                        </td>
                         
                    
                    <td>
                        <button data-category-id="${category.id}" class="edit-button">Edit</button>
                    </td>
                    <td>
                        <button data-category-id="${category.id}" class="delete-button">Delete</button>
                    </td>
                </tr>
                `)
                console.log(category.currency)

            })
        }

    const addBudgetButtons = document.querySelectorAll(".add-budget-button")

    const addBudgetModal = document.getElementById("add-budget-modal")

    const closeAddBudget = document.getElementById("close-budget") 

    const addBudgetInput = document.getElementById("add-budget-input")

    const addBudget = document.getElementById("add-budget-modal-button")

    addBudgetButtons.forEach((addBudgetButton) => {
        const categoryId = addBudgetButton.dataset.categoryId
        addBudgetButton.addEventListener("click", () => {
            addBudgetModal.style.display = "block"
            addBudgetModal.dataset.categoryId = categoryId
        })
    })

    closeAddBudget.addEventListener("click", () => {
        addBudgetModal.style.display = "none"
    })
    
    window.addEventListener("click", (event) => {
        if (event.target == addBudgetModal) {
            addBudgetModal.style.display = "none"
        }
    })

    addBudget.addEventListener("click", async () => {
        try {
            const response = await fetch("http://localhost:3001/budget/add-budget", {
                method: "PATCH",
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    budget: addBudgetInput.value,
                    categoryId: addBudgetModal.dataset.categoryId
                }),
            })
            const budgetData = await response.json()
            console.log(budgetData)
            getAllCategories()
            addBudgetInput.value = ""
            addBudgetModal.style.display = "none"
            if (userData.user.subscriptionExpiresAt != null) {
                alert("Budget was added!")
            } else {
                alert("You can't add month budget without subscription!")
            }
            
        } catch (error) {
            console.log(error) 
            alert("ERROR! Budget wasn't added!")
        }
    })

    const addSubscriptionButtons = document.querySelectorAll('.add-subscription')

    addSubscriptionButtons.forEach((subscriptionButton) => {
        subscriptionButton.addEventListener("click", () => {
            window.location.replace("file:///Users/nataliatuh/Documents/natasha-projects/expenses_tracker/client/subscription-new.html")
        })
    })

    const editButton = document.querySelectorAll('.edit-button')
    
    const editCategoryModal = document.getElementById("edit-category-modal")

    const closeEdit = document.getElementById("close-edit")

    const editNameInput = document.getElementById("edit-name")

    const editBudgetInput = document.getElementById("edit-budget")

    const editNameButton = document.getElementById("edit-name-button")

    const editBudgetButton = document.getElementById("edit-budget-button")

    editButton.forEach((editButton, index) => {
        const categoryId = editButton.dataset.categoryId
        editButton.addEventListener("click", () => {
            editCategoryModal.style.display = "block"
            editCategoryModal.dataset.categoryId = categoryId
        })
    })

    closeEdit.addEventListener("click", () => {
        editCategoryModal.style.display = "none"
    })

    window.addEventListener("click", (event) => {
        if (event.target == editCategoryModal) {
            editCategoryModal.style.display = "none"
        }
    })

    editNameButton.addEventListener("click", async () => {
        try {
            const response = await fetch("http://localhost:3001/categories/name", {
                method: "PATCH",
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json"
                }, 
                body: JSON.stringify({
                    newName: editNameInput.value,
                    categoryId: editCategoryModal.dataset.categoryId
                })
            })

            const newNameData = await response.json()
            console.log(newNameData)
            alert("Category name was successfully changed!")
            editNameInput.value = ""
            getAllCategories()
            editCategoryModal.style.display = "none"
        } catch (error) {
            console.log(error)
            alert("ERROR! Category name wasn't changed!")
        }
        
    })

    editBudgetButton.addEventListener("click", async () => {
        try {
            const response = await fetch("http://localhost:3001/budget/add-budget", {
                method: "PATCH",
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json"
                }, 
                body: JSON.stringify({
                    budget: editBudgetInput.value,
                    categoryId: editCategoryModal.dataset.categoryId
                })
            })

            const newBudgetData = await response.json()
            console.log(newBudgetData)
            editBudgetInput.value = ""
            editCategoryModal.style.display = "none"
            getAllCategories()
            alert("Month budget was changed!")
        } catch (error) {
            console.log(error)
            alert("ERROR! Month budget wasn't changed!")
        }
    })

    const deleteCategoryButton = document.querySelectorAll('.delete-button')

    deleteCategoryButton.forEach((deleteButton) => {
        deleteButton.addEventListener("click", async () => {
            try {
                const response = await fetch("http://localhost:3001/categories", {
                    method: "DELETE",
                    headers: {
                        "Authorization": token,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        categoryId: deleteButton.dataset.categoryId
                    })
                })
    
                const data = await response.json()
                console.log(data)
                alert("Category was deleted!")
                getAllCategories()
            } catch (error) {
                console.log(error)
                alert("ERROR! Category wasn't deleted!")
            }
        })
    })
    const getBudgetSum = document.getElementById("budget-sum")

async function sumBudget() {
    try {
        const response = await fetch("http://localhost:3001/budget/sum", {
            method: "GET",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            }
        })

        const data = await response.json()
        console.log(data.monthBudgetSum)

        if (userData.user.subscriptionExpiresAt != null) {
            getBudgetSum.innerHTML = `<h4>Your need to have ${data.monthBudgetSum} ${userData.user.currency} for this month</h4>`
        }
        
    } catch (error) {
        console.log(error)
    }
}

    sumBudget()

    } catch (error) {
        console.log(error)
    }

}

getAllCategories()

const addCategoryButton = document.getElementById("add-category-button")

const addCategoryModal = document.getElementById("add-category-modal")

const closeAddCategory = document.getElementById("close-category")

addCategoryButton.addEventListener("click", () => {
    addCategoryModal.style.display = "block"
})

closeAddCategory.addEventListener("click", () => {
    addCategoryModal.style.display = "none"
})

window.addEventListener("click", (event) => {
    if (event.target == addCategoryModal) {
        addCategoryModal.style.display = "none"
    }
})

const addCategory = document.getElementById("add-category-modal-button")

addCategory.addEventListener("click", async () => {
    try {
        const userResponse = await fetch("http://localhost:3001/authorization/user", {
            method: "GET",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            }
        })
        const userData = await userResponse.json()
        const userSubscription = userData.user.subscriptionExpiresAt
        console.log(userSubscription)

        const categoriesResponse = await fetch("http://localhost:3001/categories", {
        method: "GET",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        }
        })

        const categoriesData = await categoriesResponse.json()
        const categories = categoriesData.userCategories
        

        const response = await fetch("http://localhost:3001/categories", {
            method: "POST",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: addCategoryInput.value
            })
        })

        const categoryData = await response.json()
        if (userSubscription == null && categories.length == 5 ) {
            alert("You need the subscription to add more categories!")
            addCategoryInput.value = ""
            addCategoryModal.style.display = "none"
        } else {
          alert("Category was added!")
        await getAllCategories()
        addCategoryInput.value = ""
        addCategoryModal.style.display = "none"  
        }
        console.log(categoryData)
    } catch (error) {
        console.log(error)
        alert("ERROR. Category wasn't added!")
    }
})
