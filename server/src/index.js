import dotenv from "dotenv";
import ConnectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 8000;

ConnectDB()
  // .then(() =>
  //   app.on("err", (err) => {
  //     console.log("ERR: ", err);
  //     throw err;
  //   })
  // )
  .then(() => {
    app.listen(port, () => {
      console.log(`Serving at http://localhost:${port}`);
    });
    app.get("/", (req, res) => {
      res.send("Server is ready!!!");
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed!!!", err);
  });
