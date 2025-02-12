const express = require("express");
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


// อนุญาตการเข้าถึง API จากทุกที่
app.use(cors());

// ตั้งค่าการเก็บไฟล์
const storage = multer.diskStorage({
    destination: './uploads/',  // โฟลเดอร์เก็บไฟล์
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // เปลี่ยนชื่อไฟล์ให้ไม่ซ้ำกัน
    }
});

const upload = multer({ storage });

// สร้างโฟลเดอร์สำหรับอัปโหลดไฟล์ ถ้ายังไม่มี
const fs = require('fs');
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Endpoint สำหรับอัปโหลดไฟล์
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ fileUrl: `${req.protocol}://${req.get('host')}/files/${req.file.filename}` });
});

// Endpoint สำหรับดาวน์โหลดไฟล์
app.use('/files', express.static('./uploads'));










let AliothMessage = null;
let CupidMessage = null;

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
