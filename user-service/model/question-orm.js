import { getQuestions } from './repository.js';

export async function ormGetQuestions(difficulty) {
    try {
        const questions = await getQuestions({difficulty})
        if (questions == null) { //Username not found in DB
            console.log('No questions found');
            return null;
        } else {
            console.log('Questions retrieved');
            return questions;
        }
    } catch (err) {
        console.log('ERROR: Getting the questions led to an error');
        return err
    }
}