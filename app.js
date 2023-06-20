const bodyParser = require("body-parser");
const express = require("express");
const fs = require("fs");

const app = express();

app.use(bodyParser.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-sample.json`));

app.get('/api/v1/tours', (req, res) => {
	res.status(200).json({
		status: 'success',
		results: tours.length,
		data: {
			tours: tours
		}
	});
});

app.post("/api/v1/tours", (req, res) => {

	console.log(req.body);
	const newId = tours[tours.length - 1].id + 1;
	const newTour = Object.assign({id: newId}, req.body);
	tours.push(newTour);
	console.log(newTour);

	fs.writeFile(`${__dirname}/dev-data/data/tours-sample.json`, JSON.stringify(tours), err => {
		res.status(200).json({
			status: "success",
			data: {
				tour: newTour
			}
		});
	});

});

const port = 3000;
app.listen(port, () => {
	console.log(`App is running on port ${port}`);
});