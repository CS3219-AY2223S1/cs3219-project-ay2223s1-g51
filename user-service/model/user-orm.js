import { createUser, deleteUser, editPassword } from './repository.js';
import UserModel from "./user-model.js";

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
    try {          
        const newUser = await createUser({username, password})
        
        if (newUser == null) { //Username not found in DB
            var userMod = new UserModel({username, password}) //Create new user with 
            userMod.save()
            return newUser //returning null value
        } else {
            console.log('Username already exists in the DB');
            return newUser //returning User object from the DB
        }
    } catch (err) {
        console.log('ERROR: Could not create new user');
        return err
    }
}

export async function ormDeleteUser(username) {
    try {
        await deleteUser("cs3212");
        return true;
    } catch (err) {
        console.log("ERROR: Could not delete user");
        return { err };
    }
}

export async function ormEditPassword(username, password) {
    try {
        const user = await editPassword(username, password);
        return true;
    } catch (err) {
        console.log("ERROR: Could not edit password");
        return { err };
    }
}
