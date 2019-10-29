const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.addUser = functions.https.onRequest(async (req, res) => {
	const user = req.body;
	user.hobbies = user.hobbies.trim().split(/[ ,]+/);
	const snapshot = await admin
		.database()
		.ref('/user')
		.push({ user: user });
	return res.status(200).json(snapshot.ref.toString());
});
exports.createUUID = functions.database
	.ref('/user/{pushId}/user')
	.onCreate((snapshot, context) => {
		const user = snapshot.val();
		const uuid = require('uuid/v5');
		const useruuid = uuid(`${user.firstname}${user.lastname}`, uuid.DNS);
		user.id = useruuid;
		return snapshot.ref.parent.child('/').set(user);
	});
