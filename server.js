const express = require("express");
const app = express();

app.use(express.json());

let lastMessage = "No messages yet"; // ตัวแปรเก็บข้อความล่าสุด

// Endpoint สำหรับรับข้อความ (POST)
app.post("/webhook", (req, res) => {
    const message = req.body.message;
    lastMessage = message; // อัปเดตข้อความล่าสุด
    console.log("Received Message:", message);
    res.send({ status: "OK", received: message });
});

// Endpoint สำหรับดึงข้อความล่าสุด (GET)
app.get("/get-message", (req, res) => {
    res.send({ message: lastMessage });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
