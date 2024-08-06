import { Box, Button, TextField, Typography } from "@mui/material";
import { useStore } from "../models/RootStore";
import { observer } from "mobx-react-lite";
import { ChangeEventHandler, FormEventHandler, useRef } from "react";
import { Instance } from "mobx-state-tree";
import { UserModel } from "../models/UserModel";
import { Link, useNavigate } from "react-router-dom";
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

  const formDataRef = useRef<formData>({
    name: "",
    surname: "",
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

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const user = UserModel.create(formDataRef.current);
    try {
      await user.signUp();
      rootStore.addUser(user);
    } catch (err) {
      console.log("Couldn't create new user", err);
    }
    navigate("/");
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
            Sign-up
          </Typography>
          <form
            id="sign-up-form"
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "4% 0",
              rowGap: "2rem",
              width: "inherit",
            }}
          >
            <TextField
              id="name"
              label="Name"
              variant="standard"
              required
              onChange={handleInputChange}
              sx={{
                width: "inherit",
              }}
            />
            <TextField
              id="surname"
              label="Surname"
              variant="standard"
              required
              onChange={handleInputChange}
              sx={{
                width: "inherit",
              }}
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
