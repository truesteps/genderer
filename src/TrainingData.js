'use strict';

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

module.exports =class TrainingData {
	constructor() {
		this.db = null;
		this.isConnected = false;
		this.rootDir = process.env.PWD;

		this.trainingDataSavePath = `${this.rootDir}/training-data/trained.json`;

		this._createDbConnection();
	}

	_createDbConnection() {
		// open database in memory
		this.db = new sqlite3.Database(`${this.rootDir}/training-data/names.db3`, (err) => {
			if (err) {
				return console.error(err.message);
			}

			this.isConnected = true;
		});
	}

	_closeDbConnection() {
		if (this.isConnected) {
			this.db.close();
			this.isConnected = false;
		}
	}

	_isTrained() {
		return fs.existsSync(this.trainingDataSavePath);
	}

	static _prepareTrainigData(rows) {
		return rows.map((row) => ({ input: row.name, output: row.gender }));
	}

	getTrainingData() {
		return new Promise((resolve, reject) => {
			this.db.all(`SELECT *
			             FROM firstname
			             LIMIT 500`, (err, rows) => {
				if (err) {
					reject(err);
				}

				return resolve(TrainingData._prepareTrainigData(rows));
			});
		});
	}

	saveTrainingData(network) {
		fs.writeFileSync(this.trainingDataSavePath, JSON.stringify(network.toJSON()), (err) => {
			if (err) {
				return console.error(err.message);
			}

			console.log('The file was saved!');
		});
	}
};
