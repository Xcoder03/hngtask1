// this is the starting point of your app
import dotenv from "dotenv"
import express from  "express"
import helloRoute from "./routes/route.js";


dotenv.config();
const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
}); // all access from different origins
// Root route for testing server connection
app.get("/", (req, res) => {
    res.send("Server is running!");
  });



const PORT = process.env.PORT || 8080;
app.use("/api", helloRoute)
// app.use("/api/v1/tasks", taskRoutes)


app.listen(PORT, console.log(`Omor we are back  at port ${PORT} server don set.`))