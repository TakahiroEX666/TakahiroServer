const express = require("express");
const app = express();

app.use(express.json());

let lastMessage = null; // ตัวแปรเก็บข้อความล่าสุด

// Endpoint สำหรับรับข้อความ (POST)
app.post("/webhook", (req, res) => {
    lastMessage = req.body.message; // บันทึกข้อความล่าสุด
    console.log("Received Message:", lastMessage);
    res.send({ status: "OK", received: lastMessage });
});

// Endpoint สำหรับ GET แล้วลบทันที
app.get("/get-message", (req, res) => {
    if (lastMessage) {
        const messageToSend = lastMessage; // เก็บข้อความก่อนลบ
        lastMessage = null; // ลบข้อความหลังส่ง
        res.send({ message: messageToSend });
    } else {
        res.send({ message: "No new messages" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
