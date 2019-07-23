const brain = require('brain.js');
const trainingData = require('./TrainingData');

const data = new trainingData();
const lstm = new brain.recurrent.LSTM();

data.getTrainingData()
	.then((results) => {
		lstm.train(results, {
			iterations: 1000,
		});

		data.saveTrainingData(lstm);

		const output = lstm.run(`Karla`);

		console.log(`Gender: ${output}`);
	})
	.catch((err) => {
		console.error(err);
	});
