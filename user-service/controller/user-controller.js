import {
    ormCreateUser as _createUser,
    ormDeleteUser as _deleteUser,
    ormEditPassword as _editPassword,
} from "../model/user-orm.js";

export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const resp = await _createUser(username, password);
            if (resp.err) {
                return res.status(400).json({ message: "Could not create a new user!" });
            } else {
                console.log(`Created new user ${username} successfully!`);
                return res.status(201).json({
                    message: `Created new user ${username} successfully!`,
                });
            }
        } else {
            return res.status(400).json({ message: "Username and/or Password are missing!" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Database failure when creating new user!" });
    }
}

export async function deleteUser(req, res) {
    try {
        const username = req.params.username;
        if (username) {
            const resp = await _deleteUser(username);
            if (resp.err) {
                return res.status(400).json({ message: "Could not delete user!" });
            } else {
                console.log(`Deleted user ${username} successfully!`);
                return res.status(201).json({
                    message: `Deleted user ${username} successfully!`,
                });
            }
        } else {
            return res.status(400).json({ message: "Username is missing!" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Database failure when deleting user!" });
    }
}

export async function editPassword(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const resp = await _editPassword(username, password);
            if (resp.err) {
                return res.status(400).json({ message: "Could not edit password!" });
            } else {
                console.log(`Edited password for user ${username} successfully!`);
                return res.status(201).json({
                    message: `Edited password for user ${username} successfully!`,
                });
            }
        } else {
            return res.status(400).json({ message: "Username and/or Password are missing!" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Database failure when editing password!" });
    }
}
