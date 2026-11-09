const loginPanel = document.getElementById("adminLogin");
const loginForm = document.getElementById("adminLoginForm");
const loginMessage = document.getElementById("adminMessage");
const dashboard = document.getElementById("adminDashboard");
const dashboardMessage = document.getElementById("dashboardMessage");
const customerRows = document.getElementById("customerRows");
const customerCount = document.getElementById("customerCount");
const usernameInput = document.getElementById("adminUsername");
const passwordInput = document.getElementById("adminPassword");

let adminCredentials = null;

function formatDate(value) {
    if (!value) {
        return "—";
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

function addCell(row, value) {
    const cell = document.createElement("td");
    cell.textContent = value;
    row.appendChild(cell);
}

function displayCustomers(users) {
    customerRows.replaceChildren();

    for (const user of users) {
        const row = document.createElement("tr");
        addCell(row, String(user.id));
        addCell(row, user.name || "");
        addCell(row, user.email || "");
        addCell(row, formatDate(user.createdAt));
        addCell(row, formatDate(user.lastLogin));
        customerRows.appendChild(row);
    }

    customerCount.textContent = `${users.length} registered customer${users.length === 1 ? "" : "s"}`;
    dashboardMessage.textContent = users.length ? "" : "No customers have registered yet.";
}

async function loadCustomers() {
    dashboardMessage.textContent = "Loading customers...";

    try {
        const response = await fetch("/api/users", {
            headers: {
                "X-Admin-Username": adminCredentials.username,
                "X-Admin-Key": adminCredentials.password
            }
        });
        const result = await response.json();

        if (response.status === 401) {
            throw new Error("Your admin session is no longer valid. Please sign in again.");
        }
        if (!response.ok) {
            throw new Error(result.message || "Could not load customers.");
        }

        displayCustomers(Array.isArray(result.users) ? result.users : []);
    } catch (error) {
        dashboardMessage.textContent = error.message || "Could not connect to the server.";

        if (error.message.includes("session is no longer valid")) {
            adminCredentials = null;
            dashboard.hidden = true;
            loginPanel.hidden = false;
        }
    }
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    loginMessage.textContent = "Signing in...";

    const credentials = {
        username: usernameInput.value.trim(),
        password: passwordInput.value
    };

    try {
        const response = await fetch("/api/users", {
            headers: {
                "X-Admin-Username": credentials.username,
                "X-Admin-Key": credentials.password
            }
        });
        const result = await response.json();

        if (!response.ok) {
            throw new Error(response.status === 401 ? "Incorrect admin username or password." : (result.message || "Sign in failed."));
        }

        adminCredentials = credentials;
        passwordInput.value = "";
        loginMessage.textContent = "";
        loginPanel.hidden = true;
        dashboard.hidden = false;
        displayCustomers(Array.isArray(result.users) ? result.users : []);
    } catch (error) {
        loginMessage.textContent = error.message || "Could not connect to the server.";
    }
});

document.getElementById("refreshCustomers").addEventListener("click", loadCustomers);
document.getElementById("adminSignOut").addEventListener("click", () => {
    adminCredentials = null;
    customerRows.replaceChildren();
    customerCount.textContent = "";
    dashboardMessage.textContent = "";
    dashboard.hidden = true;
    loginPanel.hidden = false;
    loginMessage.textContent = "You have signed out.";
    passwordInput.value = "";
});