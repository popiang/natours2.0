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
mongoose
    .connect(DB, {})
    .then(() => console.log("DB connection successfull!!"));

// create tour schema
const tourSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "A tour must have a name"],
		unique: true
	},
	rating: {
		type: Number,
		default: 4.5
	},
	price: {
		type: Number,
		required: [true, "A tour must have a price"]
	}
});

// use the schema to create model
const Tour = mongoose.model("Tour", tourSchema);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
