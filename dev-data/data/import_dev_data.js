const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("../../models/tourModel");

dotenv.config({ path: "../../config.env" });

console.log(process.env.DATABASE);

const DB = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
).replace('<DATABASE_NAME>', process.env.DATABASE_NAME);

mongoose.connect(DB).then(() => console.log("DB connection successfull!!"));

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours.json`, "utf-8")
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

const deleteData = async () => {
	try {
		await Tour.deleteMany();
		console.log('Data successfully deleted!!');
	} catch (error) {
		console.log(error);
	}

	process.exit();
}

if (process.argv[2] === '--import') {
	importData();
} else if (process.argv[2] == '--delete') {
	deleteData();
}

console.log(process.argv);