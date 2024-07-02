const express = require("express");
import helloRoute from "../routes/route.js";
const app = express();

app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(3000, () => console.log("Server ready on port 3000."));
app.use("/api", helloRoute)

module.exports = app;