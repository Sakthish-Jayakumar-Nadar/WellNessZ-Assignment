import express from "express";
import mongoose from "mongoose";
import routes from "./Route/routes.js";

const app = new express();
app.use(express.json());
app.listen(3000,() => { console.log("server running on port 3000"); })
mongoose.connect("mongodb://localhost:27017");
const db = mongoose.connection;
db.on("open", () => { console.log("Data Base connection is successful") });
db.on("error", () => { console.log("Data Base connection is not successful") });

routes(app);