import { Box, Button, TextField, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useStore } from "../models/RootStore";
import { Instance } from "mobx-state-tree";
import { UserModel } from "../models/UserModel";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMsg } from "../types/commonTypes";

type formData = Pick<Instance<typeof UserModel>, "email" | "password">;

export const SignInPage = observer(() => {
  const rootStore = useStore();
  const navigate = useNavigate();
  const [formDataState, setFormDataState] = useState<formData>({
    email: "",
    password: "",
  });

  const [inputEmailError, setInputEmailError] = useState(false);
  const [inputEmailHelperText, setInputEmailHelperText] = useState("");

  const [inputPasswordError, setInputPasswordError] = useState(false);
  const [inputPassHelperText, setInputPassHelperText] = useState("");

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const val = event.currentTarget.value;
    setFormDataState({
      ...formDataState,
      [`${event.currentTarget.id}`]: val,
    });
    console.log(formDataState);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    try {
      let user = UserModel.create({
        email: formDataState.email,
        password: formDataState.password,
      });

      const res = await user.signIn();
      if (user.state === "error") {
        const data = await (res?.json() as Promise<ErrorMsg>);
        if (res?.status === 404) {
          setInputEmailError(true);
          setInputEmailHelperText(data.message);
        } else {
          setInputPasswordError(true);
          setInputPassHelperText(data.message);
        }

        setFormDataState({ email: "", password: "" });
        return;
      } else if (user.state === "done") {
        const data = await (res?.json() as Promise<{
          access_token: string;
          id: string;
          name: string;
          surname: string;
        }>);
        user = UserModel.create({
          id: data.id,
          name: data.name,
          surname: data.surname,
          email: formDataState.email,
          password: "",
        });
        localStorage.setItem("token", data.access_token);
        rootStore.addUser(user);
        navigate("app");
      }
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
            rowGap: "1rem",
            width: "15rem",
          }}
        >
          <Typography variant="h2" textAlign="center">
            Welcome at HealthKit.io!
          </Typography>
          <form
            id="sign-in-form"
            onSubmit={handleSubmit}
            onInput={() => {
              if (inputEmailError || inputPasswordError) {
                setInputEmailError(false);
                setInputEmailHelperText("");

                setInputPasswordError(false);
                setInputPassHelperText("");
              }
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              rowGap: "1rem",
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
              value={formDataState.email}
              error={inputEmailError}
              helperText={inputEmailHelperText}
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
              value={formDataState.password}
              error={inputPasswordError}
              helperText={inputPassHelperText}
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
