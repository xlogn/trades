import express from "express";

const app = express();
const PORT = 8080;

app.get("/ping", (req, res) => {
  res.json({ status: 200, data: "pong" });
});

app.listen(PORT, () => {
  console.log(`Running on some port,idc ${PORT}`);
});
