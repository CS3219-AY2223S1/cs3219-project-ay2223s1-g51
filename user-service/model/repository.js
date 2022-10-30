import "dotenv/config";
import { auth } from "../firebase-config.js";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "firebase/auth";

//Set up mongoose connection
import mongoose from "mongoose";

let mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// export async function checkUserJwt(params) {
//     console.log("1");
//     const token = params.token;
//     auth.verifyIdToken(token)
//         .then(() => "valid")
//         .catch((error) => {
//             return error;
//         });
// }

export async function createUser(params) {
  const username = params.username;
  const password = params.password;

  return createUserWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return { key: "user", obj: user };
    })
    .catch((error) => {
      return { key: "error", obj: error.code };
    });
}

export async function logInUser(params) {
  const username = params.username;
  const password = params.password;
  console.log(password);

  return signInWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return { key: "user", obj: user };
    })
    .catch((error) => {
      return { key: "error", obj: error.code };
    });
}

export async function logOutUser(params) {
  return signOut(auth)
    .then(() => {
      return "1";
    })
    .catch((error) => {
      console.log(error);
      return error.code;
    });
}

export async function findUser(params) {
  const username = params.username;
  const password = params.password;
  //create a promise object which resolves to either an error or a user object from the DB
  return new Promise((resolve, reject) => {
    db.collection("usermodels").findOne({ username: username, password: password }, function (err, obj) {
      if (err) reject(err);
      resolve(obj);
    });
  });
}

export async function deleteUser(currUser, password) {
  try {
    console.log('4')
    //const user = auth.currentUser;
    const user = currUser;
    await reauthenticate(auth, password);
    console.log('8')
    await deleteUser(user).then(() => {
    console.log("Deleted!")
    return "account deleted"
    })
  } catch(error) {
    console.log(error);
    return error.code
  }
}

export async function editPassword(oldPassword, newPassword) {
  try {
    const user = auth.currentUser;
    await reauthenticate(auth, oldPassword);
    await updatePassword(user, newPassword).then(() => {
      return "success";
    });
  } catch (err) {
      return { err };
  }
}

export async function reauthenticate(auth, currentPassword) {
  const user = auth.currentUser;
  console.log('5')
  console.log(user)
  const cred = EmailAuthProvider.credential(user.email, currentPassword);
  console.log('6')
  console.log(cred)
  const result = await reauthenticateWithCredential(user, cred)
  console.log('7')
  return result 
};

export async function getQuestions(roomtype) {
  console.log(">" + roomtype);
  return db.collection("questionmodels").findOne({ difficulty: roomtype });
}
