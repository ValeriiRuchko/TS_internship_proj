import { flow, t } from "mobx-state-tree";
import fetcher from "../utils/fetchExtended";

export const UserModel = t
  .model("UserModel", {
    id: t.maybe(t.string),
    name: t.maybe(t.string),
    surname: t.maybe(t.string),
    email: t.string,
    password: t.string,
    // userExists: false,
    // state: t.enumeration("State", ["pending", "done", "error"]),
  })
  .actions((self) => ({
    signUp: flow(function* () {
      try {
        const user: { id: string } = yield fetcher("auth/sign-up", {
          method: "POST",
          body: JSON.stringify({
            name: self.name,
            surname: self.surname,
            email: self.email,
            password: self.password,
          }),
        });
        self.id = user.id;
      } catch (err) {
        console.error("Error while creating new user", err);
      }
    }),
    signIn: flow(function* () {
      // yield in these generator functions is literally like await
      // self.state = "pending";

      try {
        const token: Response = yield fetcher("auth/sign-in", {
          method: "POST",
          body: JSON.stringify({
            email: self.email,
            password: self.password,
          }),
        });
        return token;

        // self.state = "done";
      } catch (err) {
        // self.state = "error";
        console.log("Error while logging-in user", err);
      }
    }),
  }));
