const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

// to read the variables in the config file and save it in the node js environment variables
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
);

console.log(DB);

// create connection
mongoose.connect(DB, {}).then(() => console.log("DB connection successfull!!"));

// const newTour = new Tour({
//     name: "The Park Camper",
//     price: 997,
// });

// newTour
//     .save()
//     .then((doc) => {
//         console.log(doc);
//     })
//     .catch((err) => {
//         console.log("Error!!!");
//     });


const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
