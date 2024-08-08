import { Box, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useStore } from "../models/RootStore";

export const MainPage = observer(() => {
  const rootStore = useStore();

  return (
    <Box className="main_content">
      <Typography variant="h2" textAlign="center">
        {`${rootStore.user?.name}'s meds list`}
      </Typography>
    </Box>
  );
});
