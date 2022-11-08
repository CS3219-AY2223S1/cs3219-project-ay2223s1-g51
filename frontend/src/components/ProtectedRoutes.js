import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { URL_USER_VERIFYUSERTOKEN_SVC } from "../configs/user-service";
import { STATUS_CODE_UNAUTHORISED, STATUS_CODE_DATABASE_ERROR } from "../constants";

//const navigate = useNavigate();

const authRequest = async () => {
  const user = await axios.get(URL_USER_VERIFYUSERTOKEN_SVC).catch((err) => {
    if (err.response.status === STATUS_CODE_UNAUTHORISED || STATUS_CODE_DATABASE_ERROR) {
      return false
    }
  });
  return user
};

export default function ProtectedRoutes({token}) {
  const [isAuth, setAuth] = useState(false);
  useEffect(() => {
    authRequest().then(res => setAuth(res))
  }, [])
  
  return (token || isAuth) ? <Outlet /> : <Navigate to="/login" />;
};
