import { Box, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";

export const ProfilePage = observer(() => {
  return (
    <Box className="main_content">
      <Typography variant="h1">Profile info</Typography>
    </Box>
  );
});
