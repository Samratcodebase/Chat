import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import ConnectToDB from "./src/db/db.js";

ConnectToDB
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is Running on ${process.env.PORT}`);
    });
  })
  .catch(() => {
    console.log("Db Connection Failed");
});
