const functions = require('firebase-functions');
const admin = require('firebase-admin');
const uuid = require('uuid/v5');

const express = require('express');
const cors = require('cors');

admin.initializeApp();
const app = express();
app.use(cors());
/**
 * post request to create a user
 * @param req
 * @param res
 */
app.post('/', async (request, response) => {
	try {
		const user = request.body;
		user.hobbies = user.hobbies.trim().split(/[ ,]+/);
		user.id = uuid(`${user.firstname}${user.lastname}`, uuid.DNS);
		await admin
			.database()
			.ref('/users')
			.push(user);
		return response.status(200).send(user);
	} catch (error) {
		return response.status(500).send('Oh no error:' + error);
	}
});
app.get('/', async (request, response) => {
	try {
		return await admin
			.database()
			.ref('/users')
			.on('value', snapshot => {
				return response.status(200).send(snapshot.val());
			});
	} catch (error) {
		return response.status(500).send('Oh no! Error: ' + error);
	}
});
// app.delete('/:id', async (request, response) => {
// 	try {
// 		const { id } = request.params;
// 		console.log('the id of the req', id);
// 		// return response.send(id);
// 		return await admin
// 			.database()
// 			.ref('/users/{id}')
// 			.on('value', snapshot => {
// 				return response.status(200).send(snapshot.val());
// 			});
// 	} catch (error) {
// 		return response.status(500).send('Oh no! Error: ' + error);
// 	}
// });

exports.entries = functions.https.onRequest(app);
