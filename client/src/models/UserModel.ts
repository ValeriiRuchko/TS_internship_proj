import { flow, t } from "mobx-state-tree";
import fetcher from "../utils/fetchExtended";

// TODO: add state to check and correctly navigate

export const UserModel = t
  .model("UserModel", {
    id: t.maybe(t.string),
    name: t.maybe(t.string),
    surname: t.maybe(t.string),
    email: t.string,
    password: t.string,
    // userExists: false,
    state: t.maybe(t.enumeration("State", ["pending", "done", "error"])),
  })
  .actions((self) => ({
    signUp: flow(function*() {
      self.state = "pending";

      try {
        const res: Response = yield fetcher("auth/sign-up", {
          method: "POST",
          body: JSON.stringify({
            name: self.name,
            surname: self.surname,
            email: self.email,
            password: self.password,
          }),
        });

        if (!res.ok) {
          self.state = "error";
        } else {
          self.state = "done";
        }

        return res;
      } catch (err) {
        self.state = "error";
        console.error("Error while creating new user", err);
      }
    }),
    signIn: flow(function*() {
      self.state = "pending";

      try {
        const res: Response = yield fetcher("auth/sign-in", {
          method: "POST",
          body: JSON.stringify({
            email: self.email,
            password: self.password,
          }),
        });

        if (!res.ok) {
          self.state = "error";
        } else {
          self.state = "done";
        }

        return res;
      } catch (err) {
        self.state = "error";
        console.log("Error while logging-in user", err);
      }
    }),
  }));
