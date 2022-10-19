import { getQuestions } from './repository.js';

export async function ormGetQuestions(difficulty) {
    try {
        const questions = await getQuestions({ difficulty })
        if (questions && questions.status === 200) {
            console.log('Questions retrieved');
            console.log(questions);
            return questions;
        }
        if (questions == null) {
            console.log('No questions found');
            return null;
        }
    } catch (err) {
        console.log('ERROR: Getting the questions led to an error');
        return err
    }
}