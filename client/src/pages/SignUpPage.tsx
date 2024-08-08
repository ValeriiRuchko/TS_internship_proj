import { Box, Button, TextField, Typography } from "@mui/material";
import { useStore } from "../models/RootStore";
import { observer } from "mobx-react-lite";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { Instance } from "mobx-state-tree";
import { UserModel } from "../models/UserModel";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMsg } from "../types/commonTypes";
// import { onSnapshot } from "mobx-state-tree";

// NOTE: for our store to be reactive (change of values in store makes rerender) we need to
// wrap necessary component as "observer" from "mobx-react-lite"
//
type formData = Pick<
  Instance<typeof UserModel>,
  "name" | "surname" | "email" | "password"
>;

export const SignUpPage = observer(() => {
  const rootStore = useStore();
  const navigate = useNavigate();

  const [formDataState, setFormDataState] = useState<formData>({
    name: "",
    surname: "",
    email: "",
    password: "",
  });

  const [inputEmailError, setInputEmailError] = useState(false);
  const [inputHelperText, setInputHelperText] = useState("");

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
    let user = UserModel.create(formDataState);
    try {
      const res = await user.signUp();
      if (user.state === "error") {
        const data = await (res?.json() as Promise<ErrorMsg>);
        setInputEmailError(true);
        setInputHelperText(data.message);

        setFormDataState({
          ...formDataState,
          email: "",
          password: "",
        });

        return;
      } else if (user.state === "done") {
        const data = (await res?.json()) as Promise<
          Pick<Instance<typeof UserModel>, "id" | "name" | "surname" | "email">
        >;
        user = UserModel.create({
          ...user,
          ...data,
          password: "",
        });

        rootStore.addUser(user);
        navigate("/");
      }
    } catch (err) {
      console.log("Error occured", err);
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
            Sign-up
          </Typography>
          <form
            id="sign-up-form"
            onSubmit={handleSubmit}
            onInput={() => {
              if (inputEmailError) {
                setInputEmailError(false);
                setInputHelperText("");
              }
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "4% 0",
              rowGap: "1rem",
              width: "inherit",
            }}
          >
            <TextField
              id="name"
              label="Name"
              variant="filled"
              required
              onChange={handleInputChange}
              sx={{
                width: "inherit",
              }}
              value={formDataState.name}
              helperText=" "
            />
            <TextField
              id="surname"
              label="Surname"
              variant="filled"
              required
              onChange={handleInputChange}
              sx={{
                width: "inherit",
              }}
              value={formDataState.surname}
              helperText=" "
            />
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
              helperText={inputHelperText}
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
              helperText=" "
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
              id="sign-up-submit"
              type="submit"
              form="sign-up-form"
              sx={{ width: "inherit" }}
              variant="contained"
            >
              Register
            </Button>

            <Button
              component={Link}
              to="/"
              sx={{ width: "inherit" }}
              variant="outlined"
            >
              Go back
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
});
