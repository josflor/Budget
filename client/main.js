// Not Budgeted text
const notBudgeted = document.getElementById("notBudgeted")
// Total Budgeted text
const totalBudgeted = document.getElementById("totalBudgeted")
// Total Income text
const totalIncome = document.getElementById("totalIncome");
// Total Spent text
const totalSpent = document.getElementById("totalSpent");

// transaction type dropdown
const transactionType = document.getElementById("transactionSelect");
// amount input box
const amount = document.getElementById("amount")
// category input box
const category = document.getElementById("category")
// submit button
const submit = document.getElementById("submit");
// table body
const tableBody = document.getElementById("tableBody");
// table rows
const tableRows = tableBody.getElementsByTagName('tr')

reload()

submit.addEventListener("click", async () => {
    const URL = 'http://localhost:3000';

    reload();

    const data = {
        transactionType: transactionType.value,
        category: category.value,
        amount: parseFloat(amount.value),
    };

    try {
        const response = await fetch(`${URL}/transaction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        console.log('Transaction successfully sent to the server:', result);
        
        reload();
    } catch (error) {
        console.error('Error submitting transaction:', error);
    }
});

async function reload() {
    const URL = 'http://localhost:3000';
    try {
        const response = await fetch(`${URL}/transaction`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();

        let notB = 0
        let totalB = 0
        let totalI = 0
        let totalS = 0

        const categories = {}

        result.forEach(entry => {
            if(!(entry["category"] in categories)) {
                categories[entry["category"]] = 0;
            } else {
                categories[entry["category"]] += 0;
            }

            if(entry["transactionType"] === "income") {
                console.log(entry["amount"]);

                notB = notB + entry["amount"];
                totalI = totalI + entry["amount"];
            } else if(entry["transactionType"] === "assign") {
                notB = notB - entry["amount"];
                totalB = totalB + entry["amount"];

                console.log(categories);
                console.log(entry["category"])

                const existingRow = doesRowExist(entry["category"]);
                function doesRowExist(categoryId) {
                    return document.getElementById(categoryId) !== null;
                }
                if (existingRow) {
                    // If the row exists, update the cells
                    const existingRowElement = document.getElementById(entry["category"]);
                    existingRowElement.cells[1].textContent = entry["amount"]; 
                
                    categories[entry["category"]] = 0;
                } else {
                    const newRow = tableBody.insertRow(tableBody.rows.length);
                    const categoryCell = newRow.insertCell(0);
                    const availableCell = newRow.insertCell(1);
                    const totalSpentCell = newRow.insertCell(2);

                    // set table cell contents
                    categoryCell.textContent = entry["category"];
                    availableCell.textContent = entry["amount"];
                    totalSpentCell.textContent = 0;

                    // give the table row a category id
                    newRow.id = entry["category"];

                    // add the new category to the catogories object
                    categories[entry["category"]] = 0;

                    console.log('HERE');
                    console.log(categories);
                }
            } else if(entry["transactionType"] === "spend") {
                totalB = totalB - entry["amount"];
                totalS = totalS + entry["amount"];

                if(entry["category"] in categories) {
                    categories[entry["category"]] = categories[entry["category"]] + entry["amount"];
                } else {
                    categories[entry["category"]] = entry["amount"];
                }
            }
        });

        notBudgeted.innerHTML = notB;
        totalBudgeted.innerHTML = totalB;
        totalIncome.innerHTML = totalI;
        totalSpent.innerHTML = totalS;

        for(const c in categories) {
            const existingRow = doesRowExist(c);
            function doesRowExist(categoryId) {
                return document.getElementById(categoryId) !== null;
            }
            if (existingRow) {
                // If the row exists, update the cells
                const existingRowElement = document.getElementById(c);
                existingRowElement.cells[1].textContent = existingRowElement.cells[1].textContent - categories[c];
                existingRowElement.cells[2].textContent = categories[c];
            }
        }
    } catch (error) {
        console.error('Error submitting transaction:', error);
    }
}