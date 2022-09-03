import { Button } from "react-bootstrap";
import { TextField } from "@mui/material";
import axios from "axios";
import { URL_USER_DELETE_SVC, URL_USER_EDITPASSWORD_SVC } from "../configs";
import { STATUS_CODE_DATABASE_ERROR, STATUS_CODE_SUCCESS } from "../constants";
import { useState } from "react";
import { Link } from "react-router-dom";

function HomePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMsg, setDialogMsg] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [changedPassword, setChangedPassword] = useState("");

  //hardcoded for now, need to change to dynamic later
  const handleDelete = async () => {
    const res = await axios
      .delete(URL_USER_DELETE_SVC + "yuqitan")
      .catch((err) => {
        if (err.response.status === STATUS_CODE_DATABASE_ERROR) {
          setErrorDialog("Server error, Please try again later.");
        } else {
          setErrorDialog("Please try again later.");
        }
      });

    if (res && res.status === STATUS_CODE_SUCCESS) {
      setSuccessDialog("Account successfully deleted");
      setIsDelete(true);
    }
  };

  //hardcoded for now, need to change to dynamic later
  const handleChangePassword = async () => {
    const res = await axios
      .put(URL_USER_EDITPASSWORD_SVC, {
        username: "yuqitan",
        password: changedPassword,
      })
      .catch((err) => {
        if (err.response.status === STATUS_CODE_DATABASE_ERROR) {
          setErrorDialog("Server error, Please try again later.");
        } else {
          setErrorDialog("Please try again later.");
        }
      });

    if (res && res.status === STATUS_CODE_SUCCESS) {
      setSuccessDialog("Password successfully changed");
    }
  };

  const setErrorDialog = (msg) => {
    setIsDialogOpen(true);
    setDialogTitle("Error");
    setDialogMsg(msg);
  };

  const setSuccessDialog = (msg) => {
    setIsDialogOpen(true);
    setDialogTitle("Success");
    setDialogMsg(msg);
  };

  return (
    <div>
      <div>Matching Difficulty</div>
      <div>
        <Link to="/signup">
          <Button
            component={Link}
            to="/signup"
            padding="0px"
            onClick={handleDelete}
            variant="primary"
            size="sm"
          >
            delete account
          </Button>
        </Link>
        <Link to="/signup">
          <Button
            padding="0px"
            onClick={() => {
              // navigate("/user/edit", { replace: true })
            }}
            variant="primary"
            size="sm"
          >
            Logout
          </Button>
        </Link>
        <div>
          <TextField
            label="Change Password"
            variant="standard"
            type="password"
            value={changedPassword}
            onChange={(e) => setChangedPassword(e.target.value)}
            sx={{ marginBottom: "2rem" }}
          />
        </div>
        <div>
          <Button onClick={handleChangePassword}>Change Password</Button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
