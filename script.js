// ==============================
// Get HTML elements
// ==============================

const expenseForm = document.getElementById("expenseForm");

const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseCategory = document.getElementById("expenseCategory");
const expenseDate = document.getElementById("expenseDate");

const expenseList = document.getElementById("expenseList");
const totalExpenses = document.getElementById("totalExpenses");


// ==============================
// Load expenses from localStorage
// ==============================

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];


// ==============================
// Display expenses
// ==============================

function displayExpenses() {

    expenseList.innerHTML = "";

    if (expenses.length === 0) {
        expenseList.innerHTML = `
            <p class="empty-message">No expenses yet.</p>
        `;

        updateTotal();
        return;
    }

    expenses.forEach(function (expense) {

        const expenseItem = document.createElement("div");

        expenseItem.classList.add("expense-item");

        expenseItem.innerHTML = `
            <div class="expense-info">

                <p class="expense-name">
                    ${escapeHTML(expense.name)}
                </p>

                <p class="expense-details">
                    Amount: $${expense.amount.toFixed(2)}
                </p>

                <p class="expense-details">
                    Category: ${escapeHTML(expense.category)}
                </p>

                <p class="expense-details">
                    Date: ${formatDate(expense.date)}
                </p>

            </div>

            <div class="expense-actions">

                <button
                    class="edit-btn"
                    onclick="editExpense(${expense.id})"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteExpense(${expense.id})"
                >
                    Delete
                </button>

            </div>
        `;

        expenseList.appendChild(expenseItem);
    });

    updateTotal();
}


// ==============================
// Add Expense
// ==============================

expenseForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = expenseName.value.trim();
    const amount = Number(expenseAmount.value);
    const category = expenseCategory.value;
    const date = expenseDate.value;

    // Make sure the values are valid
    if (
        name === "" ||
        amount <= 0 ||
        category === "" ||
        date === ""
    ) {
        alert("Please fill out all fields correctly.");
        return;
    }

    const newExpense = {
        id: Date.now(),
        name: name,
        amount: amount,
        category: category,
        date: date
    };

    expenses.push(newExpense);

    saveExpenses();

    displayExpenses();

    expenseForm.reset();
});


// ==============================
// Delete Expense
// ==============================

function deleteExpense(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this expense?"
    );

    if (!confirmed) {
        return;
    }

    expenses = expenses.filter(function (expense) {
        return expense.id !== id;
    });

    saveExpenses();

    displayExpenses();
}


// ==============================
// Edit Expense
// ==============================

function editExpense(id) {

    const expense = expenses.find(function (expense) {
        return expense.id === id;
    });

    if (!expense) {
        return;
    }

    // Put the existing information back into the form
    expenseName.value = expense.name;
    expenseAmount.value = expense.amount;
    expenseCategory.value = expense.category;
    expenseDate.value = expense.date;

    // Remove the old expense
    expenses = expenses.filter(function (expense) {
        return expense.id !== id;
    });

    saveExpenses();

    displayExpenses();

    // Scroll back to the form
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ==============================
// Calculate Total
// ==============================

function updateTotal() {

    const total = expenses.reduce(function (sum, expense) {
        return sum + expense.amount;
    }, 0);

    totalExpenses.textContent = total.toFixed(2);
}


// ==============================
// Save expenses to localStorage
// ==============================

function saveExpenses() {

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );
}


// ==============================
// Format Date
// ==============================

function formatDate(dateString) {

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString();
}


// ==============================
// Basic HTML escaping
// ==============================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ==============================
// Display saved expenses when page loads
// ==============================

displayExpenses();