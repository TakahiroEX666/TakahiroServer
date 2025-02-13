const express = require("express");
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

let AliothMessage = null;
let CupidMessage = null;

// MapActivity
app.use(express.static(path.join(__dirname, "public")));
app.get("/index", (req, res) => {res.sendFile(path.join(__dirname, "public", "index.html"));});

//PartFile
const storage = multer.diskStorage({
    destination: './uploads/',  // โฟลเดอร์เก็บไฟล์
    filename: (req, file, cb) => {
        //cb(null, Date.now() + path.extname(file.originalname)); // เปลี่ยนชื่อไม่ซ้ำกัน
        cb(null, file.originalname); // ใช้ชื่อไฟล์เดิม
    }
});

//Destination Storage
const upload = multer({ storage });
const fs = require('fs');
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

//Upload Files
app.post('/upload/', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json(`${req.protocol}://${req.get('host')}/files/${req.file.filename}`);
});


//Download File
app.use('/files', express.static('./uploads'));


//toAlioth
app.post("/toalioth", (req, res) => {
    AliothMessage = req.body.message;
    res.send({ status: "OK", received: AliothMessage });
});

//toCupid
app.post("/tocupid", (req, res) => {
    CupidMessage = req.body.message;
    res.send({ status: "OK", received: CupidMessage });
}); 

//getAlioth
app.get("/getalioth", (req, res) => {
    if (AliothMessage) {
        res.send({ message: AliothMessage });
        AliothMessage = null;
    } else {
        res.send({ message: "❌" });
    }
});

//getCupid
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

