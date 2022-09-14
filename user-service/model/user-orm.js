import { findUser } from './repository.js';
import UserModel from "./user-model.js";

export async function ormFindUser(username, password) {
    try {
        const newUser = await findUser({username, password})
        if (newUser == null) { //Username not found in DB
            return null
        } else {
            console.log('Username already exists in the database');
            return newUser
        }
    } catch (err) {
        console.log('ERROR: Finding the user led to an error');
        return err
    }
}
//need to separate orm functions from repository to decouple business logic from persistence
export function ormCreateUser(username, password) {
        var userMod = new UserModel({username, password}) //Create new user 
        userMod.save()
}

