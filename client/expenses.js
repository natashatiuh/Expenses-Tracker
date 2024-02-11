const token = window.localStorage.getItem("token");

const expensesTable = document.getElementById("expenses-table")

const editExpenseModal = document.getElementById("edit-expense-modal")

const categoriesList = document.getElementById("categories")

async function getCategoriesName() {
    try {
        const categoriesResponse = await fetch("http://localhost:3001/categories/names", {
            method: "GET",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            }
        }) 
    
        const data = await categoriesResponse.json()
        const categories = data.categoriesNames
        console.log(categories)

        categoriesList.innerHTML = "";

        categories.forEach((category) => {
            const option = document.createElement("option");
            option.textContent = category.name;
            option.value = category.id;
            categoriesList.appendChild(option);
            console.log(category.id)
        });
    } catch (error) {
        console.log(error)
        alert("ERROR! NO categories!")
    }
}

getCategoriesName()

async function getAllExpenses() {
    try {
        const categoryResponse = await fetch("http://localhost:3001/categories/", {
            method: "GET",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            }
        })

        const categoryData = await categoryResponse.json()
        console.log(categoryData)
        const categories = categoryData.userCategories

        const response = await fetch("http://localhost:3001/expenses/all", {
            method: "GET",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            }
        })

        const expensesData = await response.json()
        const expenses = expensesData.expenses
        console.log(expenses)
        
        expensesTable.innerHTML = ""

        expenses.forEach((expense) => {
            const category = categories.find(cat => cat.id === expense.categoryId);
            const categoryName = category ? category.name : 'Uncategorized';
            const categoryId = category ? category.id : "Uncategorized"
            expensesTable.insertAdjacentHTML("beforeend", `
            <tr>
                <td>${expense.expenseName}</td>
                <td>${categoryName}</td>
                <td>${expense.moneyAmount}</td>
                <td>${expense.currency}</td>
                <td>
                    <button data-category-id="${categoryId}" data-expense-id="${expense.id}" class="edit-button">Edit</button>
                </td>
                <td>
                    <button data-category-id="${categoryId}" data-expense-id="${expense.id}" class="delete-button">Delete</button>
                </td>
            </tr>
            `)
        }) 

const addExpense = document.getElementById("add-expense-button")

const addExpenseModal = document.getElementById("add-expense-modal")

const closeExpense = document.getElementById("close-expense")

addExpense.addEventListener("click", () => {
    addExpenseModal.style.display = "block"
})

closeExpense.addEventListener("click", () => {
    addExpenseModal.style.display = "none"
})

window.addEventListener("click", (event) => {
    if (event.target == addExpenseModal) {
        addExpenseModal.style.display = "none"
    }
})

const editButtons = document.querySelectorAll(".edit-button") 

const closeEdit = document.getElementById("close-edit")

editButtons.forEach((editButton) => {
    const expenseId = editButton.dataset.expenseId
    editButton.addEventListener("click", () => {
        editExpenseModal.style.display = "block"
        editExpenseModal.dataset.expenseId = expenseId
    })
})

closeEdit.addEventListener("click", () => {
    editExpenseModal.style.display = "none"
})

window.addEventListener("click", (event) => {
    if (event.target == editExpenseModal) {
        editExpenseModal.style.display = "none"
    }
})

    } catch (error) {
        console.log(error)
        alert("ERROR! No Expenses!")
    }

    const deleteButtons = document.querySelectorAll(".delete-button")

        deleteButtons.forEach((deleteButton) => {
            deleteButton.addEventListener("click", async () => {
                try {
                    const response = await fetch("http://localhost:3001/expenses", {
                        method: "DELETE",
                        headers: {
                            "Authorization": token,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            expenseId: deleteButton.dataset.expenseId
                        })
                    })

                    const data = await response.json()
                    console.log(data)
                    alert("Expense was deleted!")
                    getAllExpenses()
                    getExpenseSummary()
                    getTotalExpense()
                } catch (error) {
                    console.log(error)
                    alert("ERROR! Expense wasn't deleted!")
                }
            })
        })
}


const expenseNameInput = document.getElementById("expense-name")

const expensePriceInput = document.getElementById("price")

const addExpenseModal = document.getElementById("add-expense-modal")

const addExpenseButton = document.getElementById("add-expense-button-modal")

addExpenseButton.addEventListener("click", async () => {
    try {
        const response = await fetch("http://localhost:3001/expenses", {
            method: "POST",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                expenseName: expenseNameInput.value,
                categoryId: categoriesList.value,
                moneyAmount: expensePriceInput.value
            })
        })

        const expensesData = await response.json()
        console.log(expensesData)
        if (expenseNameInput.value != "" && expensePriceInput.value != "") {
           alert("Expense was added!")
            expenseNameInput.value = ""
            expensePriceInput.value = ""
            addExpenseModal.style.display = "none"
            getAllExpenses() 
            getExpenseSummary()
            getTotalExpense()
        } else {
            alert("Fill all information, please!")
        }
        

    } catch (error) {
        console.log(error)
        alert("ERROR! Expense wasn't added!")
    }
})

const categoriesListForEdit = document.getElementById("edit-categories")

async function getCategoryNamesForEdit() {
    try {
        const categoriesResponse = await fetch("http://localhost:3001/categories/names", {
            method: "GET",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            }
        }) 
    
        const data = await categoriesResponse.json()
        const categories = data.categoriesNames
        console.log(categories)

        categoriesListForEdit.innerHTML = "";

        categories.forEach((category) => {
            const option = document.createElement("option");
            option.textContent = category.name;
            option.value = category.id;
            categoriesListForEdit.appendChild(option);
            console.log(category.id)
        });
    } catch (error) {
        console.log(error)
        alert("ERROR! NO categories!")
    }
}

const editExpenseNameInput = document.getElementById("edit-name-input")

const changeNameButton = document.getElementById("change-name-button")

changeNameButton.addEventListener("click", async () => {
    try {
        const response = await fetch("http://localhost:3001/expenses", {
            method: "PATCH",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                expenseId: editExpenseModal.dataset.expenseId,
                expenseName: editExpenseNameInput.value
            })
        })

        const data = await response.json()
        console.log(data)
        alert("Expense name was changed!")
        editExpenseNameInput.value = ""
        editExpenseModal.style.display = "none"
        getAllExpenses()
    } catch (error) {
        console.log(error)
        alert("ERROR! Expense name wasn't changed!")
    }
})

const editCategorySelection = document.getElementById("edit-categories")

const changeCategoryButton = document.getElementById("edit-category-button")

changeCategoryButton.addEventListener("click", async () => {
    try {
        const response = await fetch("http://localhost:3001/expenses", {
            method: "PATCH",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                expenseId: editExpenseModal.dataset.expenseId,
                categoryId: editCategorySelection.value
            })
        })

        const data = await response.json()
        console.log(data)
        alert("Category was changed!")
        editExpenseModal.style.display = "none"
        getAllExpenses()
        getExpenseSummary()
    } catch (error) {
        console.log(error)
        alert("ERROR! Category wasn't changed!")
    }
})

const changePriceInput = document.getElementById("edit-price")

const changePriceButton = document.getElementById("edit-price-button")

changePriceButton.addEventListener("click", async () => {
    try {
        const response = await fetch("http://localhost:3001/expenses", {
            method: "PATCH",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                expenseId: editExpenseModal.dataset.expenseId,
                moneyAmount: changePriceInput.value
            })
        })

        const data = await response.json()
        console.log(data)
        alert("Price was changed!")
        changePriceInput.value = ""
        editExpenseModal.style.display = "none"
        getAllExpenses()
        getExpenseSummary()
        getTotalExpense()
    } catch (error) {
        console.log(error)
        alert("ERROR! Price wasn't changed!")
    }
})

const expenseSumTable = document.getElementById("expenses-sum-table")

async function getExpenseSummary() {
    try {
        const categoryResponse = await fetch("http://localhost:3001/categories/", {
            method: "GET",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            }
        })

        const categoryData = await categoryResponse.json()
        console.log(categoryData)
        const categories = categoryData.userCategories

        const response = await fetch("http://localhost:3001/expenses/all", {
            method: "GET",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            }
        })

        const expensesData = await response.json()
        const expenses = expensesData.expenses
        console.log(expenses)

        const aggregatedExpenses = {};
        
        expenses.forEach((expense) => {
            const categoryName = categories.find(cat => cat.id === expense.categoryId)?.name || 'Uncategorized';
            if (!aggregatedExpenses[categoryName]) {
                aggregatedExpenses[categoryName] = 0;
            }
            aggregatedExpenses[categoryName] += parseFloat(expense.moneyAmount);
        });

        expenseSumTable.innerHTML = ""

        Object.entries(aggregatedExpenses).forEach(([categoryName, totalAmount]) => {
            const integerAmount = Math.round(totalAmount);
            expenseSumTable.insertAdjacentHTML("beforeend", `
            <tr>
                <td>${categoryName}</td>
                <td>${integerAmount}</td>
                <td>${expenses[0]?.currency}</td> <!-- Assuming all expenses have the same currency -->
            </tr>
            `);
        });

        

} catch (error) {
    console.log(error)
    alert("ERROR!")
}

}

const totalExpense = document.getElementById("total-expense")

async function getTotalExpense() {
    try {
        const response = await fetch("http://localhost:3001/expenses/expenses-sum", {
            method: "GET",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            }
        })

        totalExpense.innerHTML = ""

        const data = await response.json()
        console.log(data)
        totalExpense.innerHTML = `Total expense is: ${data.expensesSum.expensesSum} ${data.expensesSum.currency}`

    } catch (error) {
        console.log(error)
        alert("ERROR!")
    }
}



getAllExpenses()
getCategoryNamesForEdit()
getExpenseSummary()
getTotalExpense()
