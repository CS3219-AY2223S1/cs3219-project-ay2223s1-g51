// ConfirmDialog.jsx
// material ui
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";

const AboutUs = (props) => {
  const { openAboutUs, setOpenAboutUs } = props;
  const handleClick = () => {
    setOpenAboutUs((prev) => !prev);
  };
  return (
    <Dialog open={openAboutUs} maxWidth="sm" fullWidth>
      <DialogTitle>AboutUs</DialogTitle>
      <Box position="absolute" top={0} right={0}>
        <IconButton>
          <Close />
        </IconButton>
      </Box>
      <DialogContent>
        <Typography>This product is made by Zong Yu, Ryan, Jia Ming and Yu Qi</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClick} color="primary" variant="contained">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AboutUs;
