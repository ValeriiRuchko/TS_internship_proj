import { Instance, t } from "mobx-state-tree";
import { MedModel } from "./MedModel";
import { UserModel } from "./UserModel";

export const RootStore = t
  .model("RootStore", {
    meds: t.array(MedModel),
    user: t.maybe(UserModel),
  })
  .actions((self) => ({
    addMed: (med: Instance<typeof MedModel>) => {
      self.meds.push(med);
    },

    addUser: (user: Instance<typeof UserModel>) => {
      self.user = user;
    },
  }));

// .view(med => {
// NOTE: will allow to transform data in some sense to return smth more useful for visualization based on current data
// })

export type RootStoreType = Instance<typeof RootStore>;

let rootStore: RootStoreType;
export function useStore() {
  if (!rootStore) {
    rootStore = RootStore.create({
      meds: [],
      user: undefined,
    });
  }

  return rootStore;
}
