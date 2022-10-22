import { Typography, Stack, Box, Grid } from "@mui/material";
import { useState } from "react";

const HistoryCard = (props) => {
  const [difficulty, setDifficulty] = useState("Easy");
  const { buddy, question, progress, date } = props;
  return (
    <Grid item xs={3}>
      <Grid container spacing={2}>
        <Box
          sx={{
            bgcolor: "background.paper",
            boxShadow: 1,
            borderRadius: 2,
            p: 2,
            minHeight: 400,
            gap: 100,
            alignItems: "center",
          }}
        >
          <Stack spacing={5}>
            <Box sx={{ textAlign: "center" }}>
              <Typography component="h1" variant="h5">
                {difficulty}
              </Typography>
            </Box>
            <Box
              component="form"
              noValidate
              sx={{
                marginTop: 2,
                display: "flex-left",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "16px",
              }}
            >
              <Typography component="h1" variant="h6">
                Buddy: {buddy ? buddy : "None"} <br />
                Question: {question}
                <br />
                Date started: {date}
                <br />
                Progress: {progress}
                <br />
              </Typography>
              <div style={{ width: "400px" }}></div>
            </Box>
          </Stack>
        </Box>
        <Box>
          <div style={{ height: "25vh" }}></div>
        </Box>
      </Grid>
    </Grid>
  );
};

export default HistoryCard;
