const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

admin.initializeApp();
const app = express();
app.use(cors());
app.post('/', async (request, response) => {
	try {
		const user = request.body;
		user.hobbies = user.hobbies.trim().split(/[ ,]+/);
		const snapshot = await admin
			.database()
			.ref('/user')
			.push({ user: user });
		return response.status(200).json(snapshot.ref.toString());
	} catch (error) {
		return response.status(500).send('Oh no error:' + error);
	}
});
app.get('/', async (request, response) => {
	try {
		return await admin
			.database()
			.ref('/user')
			.on('value', snapshot => {
				return response.status(200).send(snapshot.val());
			});
	} catch (error) {
		return response.status(500).send('Oh no! Error: ' + error);
	}
});

exports.entries = functions.https.onRequest(app);
exports.createUUID = functions.database
	.ref('/user/{pushId}/user')
	.onCreate((snapshot, context) => {
		const user = snapshot.val();
		const uuid = require('uuid/v5');
		const useruuid = uuid(
			`${user.firstname}${user.lastname} ${Date.now()}`,
			uuid.DNS
		);
		user.id = useruuid;
		return snapshot.ref.parent.child('/').set(user);
	});
