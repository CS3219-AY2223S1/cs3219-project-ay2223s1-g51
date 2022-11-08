import {
  ormCreateUser as _createUser,
  ormLogInUser as _logInUser,
  ormLogOutUser as _logOutUser,
  ormDeleteCurrUser as _deleteCurrUser,
  ormEditPassword as _editPassword,
  ormVerifyUserToken as _verifyUserToken
} from "../model/user-orm.js";

export async function verifyUserToken(req, res) {
    try {
        const resp = await _verifyUserToken();
        if (resp == null) {
          return res.status(401).json({ message: `Not authorised` });
        } else {
          console.log(`Current user has valid token`);
          return res.status(200).json( true );
            
        }
    } catch (err) {
        return res.status(500).json({ message: `Database failure when checking JWT of current user!` });
    }
}

export async function createUser(req, res) {
  try {
    const { username, password } = req.body;
    if (username && password) {
      try {
        const resp = await _createUser(username, password);
        if (resp["key"] == "error") {
          errorMsg = resp["obj"];
          if (errorMsg == "auth/email-already-in-use") {
            console.log("Username already in use");
            return res.status(409).json({ message: errorMsg });
          } else if (errorMsg == "auth/invalid-email") {
            console.log("Invalid username format");
            return res.status(400).json({ message: errorMsg });
          } else if (errorMsg == "auth/weak-password") {
            console.log("Weak password");
            return res.status(400).json({ message: errorMsg });
          }
        } else if (resp["key"] == "user") {
          console.log("Successfully created user");
          return res.status(201).json({ message: `Created new user ${username} successfully!` });
        }
      } catch (err) {
        return res.status(400).json({ message: "Failed to create user!" });
      }
    } else {
      return res.status(400).json({ message: "Username and/or Password are missing!" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Database failure when creating new user!" });
  }
}

export async function logInUser(req, res) {
  try {
    const { username, password } = req.body;
    if (username && password) {
      try {
        const resp = await _logInUser(username, password);
        if (resp["key"] == "error") {
          const errorMsg = resp["obj"];
          if (errorMsg == "auth/wrong-password" || errorMsg == "auth/user-not-found" || errorMsg == "auth/invalid-email") {
            console.log("Wrong username or password");
            return res.status(404).json({ message: errorMsg });
          } else if (errorMsg == "auth/too-many-requests") {
            return res.status(400).json({ message: errorMsg });
          }
        }

        if (resp["key"] == "user") {
          console.log(`Successfully logged into user account ${username}.`);
          return res.status(200).json({ resp });
        }
      } catch {
        return res.status(500).json({ message: `Database failure when logging in to user account!` });
      }
    } else {
      return res.status(404).json({ message: "Username and/or Password are missing!" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Database failure when logging in to user account!" });
  }
}

export async function logOutUser(req, res) {
  try {
    const resp = await _logOutUser();
    console.log("resp: " + resp);
    if (resp == "1") {
      console.log(`Successfully logged out`);
      return res.status(200).json({ message: `Logged out successfully!` });
    } else {
      return res.status(400).json({ message: `Failed to log out` });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `Database failure when logging out!` });
  }
}

export async function deleteCurrUser(req, res) {
  try {
    const password = req.body.password
    if (password) {
      const resp = await _deleteCurrUser(password);
      if (resp) {
        console.log(`Deleted user successfully!`);
        return res.status(200).json({message: `Deleted user successfully!`});
      } else {
        console.log(`Wrong password`)
        return res.status(400).json({message: `Wrong password`});
      }
    } else {
      return res.status(404).json({ message: "Password is missing!" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Database failure when deleting user!" });
  }
}

export async function editPassword(req, res) {
  try {
    const { username, oldPassword, newPassword } = req.body;
    if (oldPassword && newPassword) {
      const resp = await _editPassword(oldPassword, newPassword);
      if (resp) {
        return res.status(200).json({message: `Edited password for user ${username} successfully!`});
      } else {
        return res.status(400).json({message: `Wrong password`});
      }
    } else {
      return res.status(400).json({ message: "Username and/or Password are missing!" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Database failure when editing password!" });
  }
}
