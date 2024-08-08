import { Box, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";

export const StatisticsPage = observer(() => {
  return (
    <Box className="main_content">
      <Typography variant="h1">Observing statistics</Typography>
    </Box>
  );
});
