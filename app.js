const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt"); // Password hashing
const jwt = require("jsonwebtoken"); // JWT for authentication
const pool = require("/var/lib/pgsql/db.js"); // PostgreSQL connection
const bodyParser = require("body-parser"); // JSON parsing middleware
require("dotenv").config(); // Load environment variables

const app = express();
const port = 3000;

// Enable CORS with updated configuration
const corsOptions = {
    origin: "http://d91uokaxdaif1.cloudfront.net", // Replace with your CloudFront domain
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,  // Allow credentials (cookies, Authorization headers)
    allowedHeaders: ["Content-Type", "Authorization"],  // Allow the Authorization header for JWT
};
app.use(cors(corsOptions)); // Apply CORS middleware
app.use(bodyParser.json()); // Enable JSON parsing

// ? In-memory Token Blacklist (Temporary Solution)
const blacklistedTokens = new Set();

// ? API Route - Test Database Connection
app.get("/api", async (req, res) => {
    try {
        const result = await pool.query("SELECT 'Hello from PostgreSQL!' AS message");
        res.json({ message: result.rows[0].message });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ? Health Check Endpoint
app.get("/health", (req, res) => {
    res.status(200).send("OK"); // Respond with 200 OK if healthy
});

// ? User Signup Endpoint
app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const result = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ? User Login Endpoint
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userQuery.rows.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = userQuery.rows[0];

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );

        res.json({ message: "Login successful", token });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ? Middleware to Authenticate JWT Token
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ error: "Access denied. No token provided." });
    }

    if (blacklistedTokens.has(token)) {
        return res.status(401).json({ error: "Token has been invalidated. Please log in again." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ error: "Invalid token" });
        }
        req.user = user; // Attach user info to request
        next();
    });
};

// ? User Logout Endpoint (Invalidate JWT)
app.post("/logout", authenticateToken, (req, res) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (token) {
        blacklistedTokens.add(token); // Add token to blacklist
    }

    res.json({ message: "User logged out successfully" });
});

// ? Secure API Route (Example)
app.get("/secure-data", authenticateToken, (req, res) => {
    res.json({ message: "This is a secure endpoint!", user: req.user });
});

// ? Start the Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});