const URI_USER_SVC = process.env.URI_USER_SVC || "http://localhost:8001";

const PREFIX_USER_SVC = "/api/user";

export const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC;
export const URL_USER_LOGINUSER_SVC = URL_USER_SVC + "/loginuser";
export const URL_USER_LOGOUTUSER_SVC = URL_USER_SVC + "/logoutuser";
// export const URL_USER_CHECKUSERJWT_SVC = URL_USER_SVC + "/checkuserjwt";
//export const URL_USER_DELETE_SVC = URL_USER_SVC + "/:";
export const URL_USER_DELETE_SVC = URL_USER_SVC + "/deleteuser";
export const URL_USER_EDITPASSWORD_SVC = URL_USER_SVC + "/editpassword";
export const URL_QUESTION_GETQUESTION_SVC = URL_USER_SVC + "/getquestions/";
