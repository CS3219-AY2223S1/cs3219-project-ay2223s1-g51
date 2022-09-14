import { ormCreateUser as _createUser } from '../model/user-orm.js'
import { ormFindUser as _findUser } from '../model/user-orm.js'


export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const resp = await _findUser(username, password);
            if(resp == null) {
                _createUser(username, password)
                console.log(`New user ${username} has been created successfully.`)
                return res.status(201).json({message: `Created new user ${username} successfully!`});
            } else if(resp) {
                return res.status(409).json({message: `User ${username} found, please use another username!`});
            } 
        } 
		else {
            return res.status(400).json({message: 'Username and/or Password are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new user!'})
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
