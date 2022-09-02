import { createUser, deleteUser } from "./repository.js";

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
  try {
    const newUser = await createUser({ username, password });
    newUser.save();
    return true;
  } catch (err) {
    console.log("ERROR: Could not create new user");
    return { err };
  }
}

export async function ormDeleteUser(username) {
  try {
    const user = await deleteUser(username);
    return true;
  } catch (err) {
    console.log("ERROR: Could not delete user");
    return { err };
  }
}
