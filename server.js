// =========================================================
// MAEKINI DATABASE SERVER
// =========================================================
// This file creates a local SQLite database named maekini.db.
// It stores registered customers and their registration/login times.
// Run this project with: node server.js
// Then open: http://localhost:3000

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");

const PORT = 3000;
const ADMIN_KEY = process.env.MAEKINI_ADMIN_KEY || "maekini-admin";
const ROOT = __dirname;
const DATABASE_FILE = path.join(ROOT, "maekini.db");

const database = new DatabaseSync(DATABASE_FILE);

database.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL,
        last_login TEXT
    );
`);

const findUserByEmail = database.prepare(`
    SELECT id, name, email, password_hash, created_at, last_login
    FROM users
    WHERE email = ?
`);

const insertUser = database.prepare(`
    INSERT INTO users (name, email, password_hash, created_at)
    VALUES (?, ?, ?, ?)
`);

const updateLastLogin = database.prepare(`
    UPDATE users
    SET last_login = ?
    WHERE id = ?
`);

const getUsers = database.prepare(`
    SELECT id, name, email, created_at, last_login
    FROM users
    ORDER BY id DESC
`);

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${hash}`;
}

function verifyPassword(password, storedPassword) {
    const [salt, storedHash] = storedPassword.split(":");
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");

    return crypto.timingSafeEqual(
        Buffer.from(hash, "hex"),
        Buffer.from(storedHash, "hex")
    );
}

function sendJson(response, statusCode, data) {
    response.writeHead(statusCode, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });
    response.end(JSON.stringify(data));
}

function readBody(request) {
    return new Promise((resolve, reject) => {
        let body = "";

        request.on("data", (chunk) => {
            body += chunk;

            if (body.length > 1000000) {
                reject(new Error("Request is too large."));
                request.destroy();
            }
        });

        request.on("end", () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch {
                reject(new Error("Invalid JSON."));
            }
        });

        request.on("error", reject);
    });
}

function cleanUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
        lastLogin: user.last_login
    };
}

function handleRegister(request, response) {
    readBody(request)
        .then((body) => {
            const name = String(body.name || "").trim();
            const email = String(body.email || "").trim().toLowerCase();
            const password = String(body.password || "");

            if (!name || !email || !password) {
                return sendJson(response, 400, {
                    message: "Please complete all registration fields."
                });
            }

            if (password.length < 6) {
                return sendJson(response, 400, {
                    message: "Password must be at least 6 characters."
                });
            }

            if (!email.includes("@")) {
                return sendJson(response, 400, {
                    message: "Please enter a valid email address."
                });
            }

            const existingUser = findUserByEmail.get(email);

            if (existingUser) {
                return sendJson(response, 409, {
                    message: "That email is already registered."
                });
            }

            const createdAt = new Date().toISOString();
            const passwordHash = hashPassword(password);
            const result = insertUser.run(
                name,
                email,
                passwordHash,
                createdAt
            );

            const newUser = {
                id: Number(result.lastInsertRowid),
                name: name,
                email: email,
                created_at: createdAt,
                last_login: null
            };

            sendJson(response, 201, {
                message: "Registration successful.",
                user: cleanUser(newUser)
            });
        })
        .catch((error) => {
            sendJson(response, 400, {
                message: error.message
            });
        });
}

function handleLogin(request, response) {
    readBody(request)
        .then((body) => {
            const email = String(body.email || "").trim().toLowerCase();
            const password = String(body.password || "");
            const user = findUserByEmail.get(email);

            if (!user || !verifyPassword(password, user.password_hash)) {
                return sendJson(response, 401, {
                    message: "Incorrect email or password."
                });
            }

            const loginTime = new Date().toISOString();
            updateLastLogin.run(loginTime, user.id);
            user.last_login = loginTime;

            sendJson(response, 200, {
                message: "Login successful.",
                user: cleanUser(user)
            });
        })
        .catch((error) => {
            sendJson(response, 400, {
                message: error.message
            });
        });
}

function handleUsers(request, response) {
    const key = request.headers["x-admin-key"];

    if (key !== ADMIN_KEY) {
        return sendJson(response, 401, {
            message: "Invalid admin key."
        });
    }

    const users = getUsers.all().map(cleanUser);

    sendJson(response, 200, {
        users: users
    });
}

function handleProductImages(request, response) {
    const productsFolder = path.join(ROOT, "assets", "products");
    const result = {};
    const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

    if (!fs.existsSync(productsFolder)) {
        return sendJson(response, 200, result);
    }

    const productFolders = fs.readdirSync(productsFolder, { withFileTypes: true });

    for (const folder of productFolders) {
        if (!folder.isDirectory()) {
            continue;
        }

        if (!/^\d+$/.test(folder.name)) {
            continue;
        }

        const folderPath = path.join(productsFolder, folder.name);
        const image = fs.readdirSync(folderPath).find((file) => {
            return allowedExtensions.has(path.extname(file).toLowerCase());
        });

        if (image) {
            result[folder.name] = `/assets/products/${folder.name}/${encodeURIComponent(image)}`;
        }
    }

    sendJson(response, 200, result);
}

const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".txt": "text/plain; charset=utf-8"
};

function serveFile(request, response) {
    let requestedPath = decodeURIComponent(request.url.split("?")[0]);

    if (requestedPath === "/") {
        requestedPath = "/index.html";
    }

    const filePath = path.normalize(path.join(ROOT, requestedPath));

    if (!filePath.startsWith(ROOT)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
    }

    fs.readFile(filePath, (error, file) => {
        if (error) {
            response.writeHead(404, {
                "Content-Type": "text/plain; charset=utf-8"
            });
            response.end("File not found.");
            return;
        }

        const extension = path.extname(filePath).toLowerCase();

        response.writeHead(200, {
            "Content-Type": contentTypes[extension] || "application/octet-stream"
        });
        response.end(file);
    });
}

const server = http.createServer((request, response) => {
    const url = request.url.split("?")[0];

    if (request.method === "OPTIONS") {
        response.writeHead(204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, X-Admin-Key"
        });
        response.end();
        return;
    }

    if (request.method === "POST" && url === "/api/register") {
        return handleRegister(request, response);
    }

    if (request.method === "POST" && url === "/api/login") {
        return handleLogin(request, response);
    }

    if (request.method === "GET" && url === "/api/users") {
        return handleUsers(request, response);
    }

    if (request.method === "GET" && url === "/api/product-images") {
        return handleProductImages(request, response);
    }

    serveFile(request, response);
});

server.listen(PORT, () => {
    console.log("Maekini is running at http://localhost:" + PORT);
    console.log("Admin page: http://localhost:" + PORT + "/admin.html");
    console.log("Default demo admin key: " + ADMIN_KEY);
});
