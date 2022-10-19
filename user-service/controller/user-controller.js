import {
    ormCreateUser as _createUser,
    ormLogInUser as _logInUser,
    ormDeleteUser as _deleteUser,
    ormEditPassword as _editPassword,
    ormFindUser as _findUser 
} from "../model/user-orm.js";

export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            try {
                const resp = await _createUser(username, password);

                if (resp['key'] == "error") {
                    errorMsg = resp['obj']
                    console.log(errorMsg);
                    if (errorMsg == "auth/email-already-in-use") {
                        console.log('Username already in use');
                        return res.status(409).json({message: errorMsg})
                    } else if (errorMsg == "auth/invalid-email") {
                        console.log('Invalid username format')
                        return res.status(400).json({message: errorMsg})
                    } else if (errorMsg == "auth/weak-password") {
                        console.log('Weak password');
                        return res.status(400).json({message: errorMsg})
                    }
                } else if (resp['key'] == "user") {
                    console.log('Successfully created user');
                    return res.status(201).json({message: `Created new user ${username} successfully!`});
                    }  
            } catch (err) {
                return res.status(400).json({message: 'Failed to create user!'});
            } 
        } else {
            return res.status(400).json({message: 'Username and/or Password are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new user!'})
    }
}

export async function logInUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            try {
                const resp = await _logInUser(username, password);

                if(resp['key'] == "error") {
                    errorMsg = resp['obj']
                    console.log(errorMsg)
                    if (resp['obj'] == "auth/wrong-password" || "auth/user-not-found" || "auth/invalid-email") {
                        console.log('Wrong username or password');
                        return res.status(404).json({message: errorMsg});
                    } else if (newUser['obj'] == "auth/too-many-requests") {
                        return res.status(500).json({message: 'Database failure when logging in to user account!'})
                    }  
                }
        
                if(resp['key'] == "user") {
                    console.log(`New user ${username} has been created successfully.`)
                    return res.status(200).json({message: `Logged into user ${username} successfully!`});
                }

            } catch {
                return res.status(500).json({message: `Database failure when logging in to user account!`});
            } 
        } 
		else {
            return res.status(400).json({message: 'Username and/or Password are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when logging in to user account!'})
    }
}

export async function findUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const resp = await _findUser(username, password);
            if(resp == null) {
                return res.status(404).json({message: `User ${username} does not exist!`});
            } else if(resp) {
                console.log(`User ${username} found.`)
                return res.status(200).json({message: `User ${username} exists!`});
            } 
        } 
		else {
            return res.status(400).json({message: 'Username and/or Password are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new user!'})
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
