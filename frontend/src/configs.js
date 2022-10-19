const URI_USER_SVC = process.env.URI_USER_SVC || "http://localhost:8000";

const PREFIX_USER_SVC = "/api/user";

export const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC;
export const URL_USER_LOGINUSER_SVC = URL_USER_SVC + "/loginuser";
export const URL_USER_FINDUSER_SVC = URL_USER_SVC + "/finduser";
export const URL_USER_DELETE_SVC = URL_USER_SVC + "/:";
export const URL_USER_EDITPASSWORD_SVC = URL_USER_SVC + "/editpassword";