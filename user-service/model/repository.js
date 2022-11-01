import "dotenv/config";
import admin from "../firebase-admin-config.js"; //need for firebase service acc to verify tokens
import { auth } from "../firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

export async function verifyUserToken() {
    const user = auth.currentUser;
    
    if (user == null) { //user not authenticated, not currently logged in
      return user
    }

    const token = await user.getIdToken(true)
    .then(function(idToken){
      return idToken;
    }).catch((err) => {
      return err;
    })

    const verifiedToken = await admin.auth().verifyIdToken(token)
    .then((decodedToken) => {
      return decodedToken
    }).catch((err) => {
      return err;
    })
    return verifiedToken
}

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
      return error.code;
    });
}

export async function deleteCurrUser(password) {
  try {
    const result = await reauthenticate(password);

    if (result == "auth/wrong-password") {
      return null
    }

    return await deleteUser(result.user)
      .then(function() {
        return true
      })
      .catch(function() {
        return null
      })

  } catch(error) {
    return error
  }
}

export async function reauthenticate(currentPassword) {
  const user = auth.currentUser;
  const cred = EmailAuthProvider.credential(user.email, currentPassword);
  return await reauthenticateWithCredential(user, cred)
    .then(function(userCred) {
      return userCred
    })
    .catch(function(error) {
      return error.code
    })
};

export async function editPassword(oldPassword, newPassword) {
  try {
    const result = await reauthenticate(oldPassword);

    if (result == "auth/wrong-password") {
      return null
    } else { 
      return await updatePassword(result.user, newPassword)
      .then(() => {
        return true;
      });
    }
  } catch (err) {
      return null;
  }
}

export async function getQuestions(roomtype) {
  console.log(">" + roomtype);
  return db.collection("questionmodels").findOne({ difficulty: roomtype });
}
