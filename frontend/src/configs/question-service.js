const URI_QUESTION_SVC = process.env.URI_QUESTION_SVC || "http://localhost:8002";

const PREFIX_QUESTION_SVC = "/api/question";

export const URL_QUESTION_SVC = URI_QUESTION_SVC + PREFIX_QUESTION_SVC;

export const URL_QUESTION_GETQUESTION_SVC = URL_QUESTION_SVC + "/getquestions/";
