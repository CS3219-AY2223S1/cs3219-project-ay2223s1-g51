import {
    ormGetQuestions as _getQuestions
} from "../model/question-orm.js";

export async function getQuestions(req, res) {
    console.log("monkey");
    try {
        const { roomtype } = req.body;
        console.log(roomtype)
        if (roomtype) {
            const resp = await _getQuestions(roomtype);
            if (resp == null) {
                console.log(res.status(404).json({ message: `No ${roomtype} questions found!` }));
                return res;
            } else if (resp) {
                console.log(`User ${username} found.`)
                console.log(res.status(200).json({ message: `${roomtype} questions found!` }));
                return res;
            }
        } else {
            return res.status(400).json({ message: 'Difficulty not selected!' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Database failure when getting question!' })
    }
}