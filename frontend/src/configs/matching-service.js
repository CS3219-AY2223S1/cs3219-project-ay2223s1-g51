const URI_MATCHING_SVC = process.env.URI_MATCHING_SVC || "http://localhost:8000";

const PREFIX_MATCHING_SVC = "/api/matching";

export const URL_MATCHING_SVC = URI_MATCHING_SVC + PREFIX_MATCHING_SVC;

export const URL_EXECUTE_API = URL_MATCHING_SVC + "/execute";
