import { t } from "mobx-state-tree";

export const MedModel = t.model("MedModel", {
  id: t.identifier,
  name: t.string,
  description: t.string,
  pillsAmount: t.integer,
  expirationDate: t.Date,

  // userId: t.optional(t.identifier, ""),
});
