import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "user" model, go to https://hackbibis.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "eR-OOa1O7rs4",
  fields: {
    email: {
      type: "email",
      validations: { required: true, unique: true },
      storageKey: "kzXpvYqSSqYz",
    },
    emailVerificationToken: {
      type: "string",
      storageKey: "IY3nMq_XOAsD",
    },
    emailVerificationTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "gu9SznABUGoW",
    },
    emailVerified: {
      type: "boolean",
      default: false,
      storageKey: "TdXsnlfErYpb",
    },
    firstName: {
      type: "string",
      validations: { stringLength: { min: 1, max: 50 } },
      storageKey: "AOb3k0eM10yx",
    },
    lastName: {
      type: "string",
      validations: { stringLength: { min: 1, max: 50 } },
      storageKey: "HLTV3nqHC08u",
    },
    lastSignedIn: {
      type: "dateTime",
      includeTime: true,
      storageKey: "tIG8KTQJNKSe",
    },
    password: {
      type: "password",
      validations: { required: true, strongPassword: true },
      storageKey: "Nsg2G7QkP-CD",
    },
    resetPasswordToken: {
      type: "string",
      storageKey: "kZfwxbWaDa8m",
    },
    resetPasswordTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "ab-UdlVsP8Mr",
    },
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "0O3mqOp1IbNF",
    },
  },
};
