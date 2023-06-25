const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

//* to read the variables in the config file and save it in the node js environment variables
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
).replace("<DATABASE_NAME>", process.env.DATABASE_NAME);

//* create connection
mongoose.connect(DB, {}).then(() => console.log("DB connection successfull!!"));

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
