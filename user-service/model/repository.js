import 'dotenv/config'

//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export async function createUser(params) {
    const username = params.username;
    //create a promise object which resolves to either an error or a user object from the DB
    return new Promise((resolve, reject) => { 
        db.collection("usermodels").findOne({ username: username }, function (err, obj) {
            if (err) reject(err);
            resolve(obj);
        });
    });
}
