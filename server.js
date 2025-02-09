const express = require("express");
const app = express();

app.use(express.json());

let AliothMessage = null;
let CupidMessage = null;


app.get("/server", (req, res) => {res.send({ message: "Server Running" });

app.post("/toalioth", (req, res) => {
   AliothMessage = req.body.message;
   res.send({ status: "OK", received: AliothMessage });
});

app.post("/tocupid", (req, res) => {
   CupidMessage = req.body.message;
   res.send({ status: "OK", received: AliothMessage });
});

app.get("/getalioth", (req, red) => {
   if(AliothMessage) {
      res.send({ message: AliothMessage });
      AliothMessage = null;
   } else {
      res.send({ message: "❌" });
   }
});

app.get("/getcupid", (req, red) => {
   if(CupidMessage) {
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
