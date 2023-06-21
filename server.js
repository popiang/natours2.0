const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv");

// to read the variables in the config file and save it in the node js environment variables
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log("DB connection successfull!!"));

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
