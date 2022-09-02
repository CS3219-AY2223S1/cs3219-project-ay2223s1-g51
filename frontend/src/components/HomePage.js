import { Button } from "react-bootstrap";
import axios from "axios";
import { URL_USER_DELETE_SVC } from "../configs";
import { STATUS_CODE_DATABASE_ERROR, STATUS_CODE_SUCCESS } from "../constants";
import { useState } from "react";
import { Link } from "react-router-dom";

function HomePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMsg, setDialogMsg] = useState("");
  const [isDelete, setIsDelete] = useState(false);

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
      </div>
    </div>
  );
}

export default HomePage;
