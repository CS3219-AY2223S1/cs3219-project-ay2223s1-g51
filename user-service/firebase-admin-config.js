import admin from 'firebase-admin';

import {serviceAccount} from './serviceAccount.js';

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://cs3219-8da08-default-rtdb.asia-southeast1.firebasedatabase.app"
});


export default admin;