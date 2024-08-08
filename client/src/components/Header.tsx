import {
  AppBar,
  Avatar,
  IconButton,
  Toolbar,
  Typography,
  Link as LinkComponent,
  Box,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import MedicalInformationRoundedIcon from "@mui/icons-material/MedicalInformationRounded";
import { Link } from "react-router-dom";
import { useStore } from "../models/RootStore";
import { useState } from "react";

export const Header = () => {
  const rootStore = useStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <AppBar>
      <Toolbar>
        <IconButton
          component={Link}
          to="/app"
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MedicalInformationRoundedIcon />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexGrow: 10,
            justifyContent: "end",
            alignItems: "center",
            columnGap: "1rem",
          }}
        >
          <Typography variant="h6" component="div">
            <LinkComponent component={Link} to="/app/create-and-change-med">
              Add med
            </LinkComponent>
          </Typography>
          <Divider variant="middle" orientation="vertical" flexItem />
          <Typography variant="h6" component="div">
            <LinkComponent component={Link} to="/app/statistics">
              Statistics
            </LinkComponent>
          </Typography>
          <Divider variant="middle" orientation="vertical" flexItem />
          <Typography variant="h6" component="div">
            {rootStore.user?.name}
          </Typography>
          <Box>
            <IconButton
              onClick={handleMenu}
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
            >
              <Avatar alt="default-pic" src="/smiling.png" />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={() => {
                setAnchorEl(null);
              }}
            >
              <MenuItem
                component={Link}
                to="/app/profile"
                onClick={() => {
                  setAnchorEl(null);
                }}
              >
                Profile
              </MenuItem>
              <MenuItem
                component={Link}
                to="/"
                onClick={() => {
                  setAnchorEl(null);
                  localStorage.removeItem("token");
                }}
              >
                Log-out
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
