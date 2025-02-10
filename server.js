const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

let AliothMessage = null;
let CupidMessage = null;


const db = new sqlite3.Database("./database.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
    console.log("✅ Connected to SQLite database");
});

// สร้างตารางถ้ายังไม่มี
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER
)`);

// 📌 Read (GET) - ดึงข้อมูลทั้งหมด
app.get("/users", (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 📌 Read (GET) - ดึงข้อมูลตาม ID
app.get("/users/:id", (req, res) => {
    db.get("SELECT * FROM users WHERE id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

// 📌 Write (POST) - เพิ่มข้อมูล
app.post("/users", (req, res) => {
    const { name, age } = req.body;
    db.run("INSERT INTO users (name, age) VALUES (?, ?)", [name, age], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

// 📌 Update (PUT) - อัปเดตข้อมูล
app.put("/users/:id", (req, res) => {
    const { name, age } = req.body;
    db.run("UPDATE users SET name = ?, age = ? WHERE id = ?", [name, age, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ updated: this.changes });
    });
});

// 📌 Delete (DELETE) - ลบข้อมูล
app.delete("/users/:id", (req, res) => {
    db.run("DELETE FROM users WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
