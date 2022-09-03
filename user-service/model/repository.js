import UserModel from "./user-model.js";
import "dotenv/config";

//Set up mongoose connection
import mongoose from "mongoose";

let mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
let userCollection = db.collection("usermodels");

export async function createUser(params) {
    return new UserModel(params);
}

export async function deleteUser(username) {
    var myquery = { username: { $eq: username } };
    db.collection("usermodels").deleteOne(myquery, function (err, obj) {
        if (err) throw err;
    });
}

export async function editPassword(username, password) {
    var myquery = { username: { $eq: username } };
    var newvalues = { $set: { password: password } };
    db.collection("usermodels").updateOne(myquery, newvalues, function (err, obj) {
        if (err) throw err;
    });
}
