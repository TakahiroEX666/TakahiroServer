const express = require("express");
const app = express();

app.use(express.json());

app.post("/webhook", (req, res) => {
    const message = req.body.message;
    console.log("Received Message:", message);
    res.send({ status: "OK", received: message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
