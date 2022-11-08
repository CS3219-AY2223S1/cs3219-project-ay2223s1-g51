import {
  createUser,
  logInUser,
  logOutUser,
  deleteCurrUser,
  editPassword,
  verifyUserToken
} from "./repository.js";
//import UserModel from "./user-model.js";

export async function ormVerifyUserToken(token) {
    try {
        const token = await verifyUserToken();
        return token;
    } catch (err) {
        console.log("ERROR: Checking the JWT of current user led to an error");
        throw err;
    }
}

export async function ormCreateUser(username, password) {
  try {
    const newUser = await createUser({ username, password });
    return newUser;
  } catch (err) {
    console.log("ERROR: Creating the user led to an error");
    throw err;
  }
}

export async function ormLogInUser(username, password) {
  try {
    const user = await logInUser({ username, password });
    return user;
  } catch (err) {
    console.log("ERROR: Error occured when trying to log in");
    return err;
  }
}

export async function ormLogOutUser(username, password) {
  try {
    const user = await logOutUser();
    return user;
  } catch (err) {
    console.log("ERROR: Error occured when trying to log in");
    return err;
  }
}

export async function ormFindUser(username, password) {
  try {
    const newUser = await findUser({ username, password });
    if (newUser == null) {
      //Username not found in DB
      return null;
    } else {
      console.log("Username already exists in the database");
      return newUser;
    }
  } catch (err) {
    console.log("ERROR: Finding the user led to an error");
    return err;
  }
}

export async function ormDeleteCurrUser(password) {
  try {
    const result = await deleteCurrUser(password);
    if (result == null) {
      return null;
    } else {
      return result
    }
  } catch (err) {
    console.log("ERROR: Could not delete user");
    return { err };
  }
}

export async function ormEditPassword(oldPassword, newPassword) {
  try {
    const result = await editPassword(oldPassword, newPassword);
    if (result == null) {
      return null;
    }
    return result
  } catch (err) {
    console.log("ERROR: Could not edit password");
    return { err };
  }
}
