const express = require("express");
const Database = require("better-sqlite3");
const bodyParser = require("body-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// เปิด SQLite Database
const db = new Database("./database.db", { verbose: console.log });
db.pragma("journal_mode = WAL"); // เปิด WAL Mode

// สร้างตารางถ้ายังไม่มี
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        age INTEGER
    );
`);


// 📌 Read (GET) - ดึงข้อมูลทั้งหมด
app.get("/users", (req, res) => {
    const rows = db.prepare("SELECT * FROM users").all();
    res.json(rows);
});

// 📌 Read (GET) - ดึงข้อมูลตาม ID
app.get("/users/:id", (req, res) => {
    const row = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
    res.json(row);
});

// 📌 Write (POST) - เพิ่มข้อมูล
app.post("/users", (req, res) => {
    const { name, age } = req.body;
    const stmt = db.prepare("INSERT INTO users (name, age) VALUES (?, ?)");
    const result = stmt.run(name, age);
    res.json({ id: result.lastInsertRowid });
});

// 📌 Update (PUT) - อัปเดตข้อมูล
app.put("/users/:id", (req, res) => {
    const { name, age } = req.body;
    const stmt = db.prepare("UPDATE users SET name = ?, age = ? WHERE id = ?");
    const result = stmt.run(name, age, req.params.id);
    res.json({ updated: result.changes });
});

// 📌 Delete (DELETE) - ลบข้อมูล
app.delete("/users/:id", (req, res) => {
    const stmt = db.prepare("DELETE FROM users WHERE id = ?");
    const result = stmt.run(req.params.id);
    res.json({ deleted: result.changes });
});

app.get("/server", (req, res) => {
    res.send({ message: "Server Running" });
});

app.post("/toalioth", (req, res) => {
    AliothMessage = req.body.message;
    res.send({ status: "OK", received: AliothMessage });
});

app.post("/tocupid", (req, res) => {
    CupidMessage = req.body.message;
    res.send({ status: "OK", received: CupidMessage });
});

app.get("/getalioth", (req, res) => {
    if (AliothMessage) {
        res.send({ message: AliothMessage });
        AliothMessage = null;
    } else {
        res.send({ message: "❌" });
    }
});

app.get("/getcupid", (req, res) => {
    if (CupidMessage) {
        res.send({ message: CupidMessage });
        CupidMessage = null;
    } else {
        res.send({ message: "❌" });
    }
});

// 📌 
// 📌 Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
