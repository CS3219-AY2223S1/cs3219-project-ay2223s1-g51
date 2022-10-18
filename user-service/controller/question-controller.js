import {
    ormGetQuestions as _getQuestions
} from "../model/question-orm.js";

export async function getQuestion(req, res) {
    try {
        const { difficulty } = req.body;
        if (difficulty) {
            const resp = await _getQuestions(difficulty);
            if (resp == null) {
                console.log(res.status(404).json({ message: `No ${difficulty} questions found!` }));
                return res;
            } else if (resp) {
                console.log(`User ${username} found.`)
                console.log(res.status(200).json({ message: `${difficulty} questions found!` }));
                return res;
            }
        } else {
            return res.status(400).json({ message: 'Difficulty not selected!' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Database failure when getting question!' })
    }
}