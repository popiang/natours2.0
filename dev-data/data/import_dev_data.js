const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("../../models/tourModel");

dotenv.config({ path: "./config.env" });

console.log(process.env.DATABASE);

const DB = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log("DB connection successfull"));

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours-sample.json`, "utf-8")
);

const importData = async () => {
	try {
		await Tour.create(tours);
		console.log('Data successfully loaded!!');
	} catch (error) {
		console.log(error);
	}

	process.exit();
}
