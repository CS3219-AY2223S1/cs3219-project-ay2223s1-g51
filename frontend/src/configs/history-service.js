const URI_HISTORY_SVC = process.env.URI_HISTORY_SVC || "http://localhost:8003";

const PREFIX_HISTORY_SVC = "/api/history";

export const URL_HISTORY_SVC = URI_HISTORY_SVC + PREFIX_HISTORY_SVC;

export const URL_GETHISTORY_SVC = URL_HISTORY_SVC + "/gethistory/:";
export const URL_POSTHISTORY_SVC = URL_HISTORY_SVC + "/posthistory";
