import { Box, Button, TextField, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useStore } from "../models/RootStore";
import { Instance } from "mobx-state-tree";
import { UserModel } from "../models/UserModel";
import { ChangeEventHandler, FormEventHandler, useRef } from "react";
import { Link } from "react-router-dom";

type formData = Pick<Instance<typeof UserModel>, "email" | "password">;

export const MainPage = observer(() => {
  const rootStore = useStore();
  const formDataRef = useRef<formData>({
    email: "",
    password: "",
  });

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const val = event.currentTarget.value;
    formDataRef.current = {
      ...formDataRef.current,
      [`${event.currentTarget.id}`]: val,
    };
    console.log(formDataRef.current);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    try {
      const user = UserModel.create({
        email: formDataRef.current.email,
        password: formDataRef.current.password,
      });

      user
        .signIn()
        .then((res) => {
          return res?.json();
        })
        .then((data) => {
          localStorage.setItem("token", data.access_token);
        });

      rootStore.addUser(user);
    } catch (err) {
      console.log("Couldn't login user", err);
    }
  };

  return (
    <Box className="main_content">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          rowGap: "2rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "inherit",
            rowGap: "2rem",
            width: "15rem",
          }}
        >
          <Typography variant="h2" textAlign="center">
            Welcome!
          </Typography>
          <form
            id="sign-in-form"
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              rowGap: "2rem",
              width: "inherit",
            }}
          >
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              type="email"
              required
              onChange={handleInputChange}
              sx={{
                width: "inherit",
              }}
            />
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              required
              onChange={handleInputChange}
              sx={{
                width: "inherit",
              }}
            />
          </form>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: "1rem",
              width: "inherit",
            }}
          >
            <Button
              id="sign-in-submit"
              type="submit"
              form="sign-in-form"
              variant="contained"
              sx={{
                width: "inherit",
              }}
            >
              Login
            </Button>
            <Button
              id="sign-up-redirect"
              component={Link}
              to="/sign-up"
              variant="outlined"
              sx={{
                width: "inherit",
              }}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
});
