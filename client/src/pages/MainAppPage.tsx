import { Box, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useStore } from "../models/RootStore";

export const MainAppPage = observer(() => {
  const rootStore = useStore();
  return (
    <Box className="main_content">
      <Typography variant="h1">
        Hello in our app {rootStore.user?.name}
      </Typography>
    </Box>
  );
});
