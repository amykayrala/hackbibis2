import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "BreachRecord" model, go to https://hackbibis.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "Xf_p0kttmkDY",
  fields: {
    domain: { type: "string", storageKey: "mWTbL0Qm0dgg" },
    domainParked: { type: "boolean", storageKey: "mhGbum8FjSYw" },
    domainRansomed: { type: "boolean", storageKey: "RXL01kXkqobs" },
    hasLoginForm: { type: "boolean", storageKey: "4VVGrnWPrsCI" },
    httpTitle: { type: "string", storageKey: "O1xMHgFtGfei" },
    ipAddress: { type: "string", storageKey: "DtxrB8fW4zVx" },
    isAccessible: { type: "boolean", storageKey: "cUTsnkd0qdFs" },
    isResolved: { type: "boolean", storageKey: "dkiNzbjADOxv" },
    needsEnrichment: {
      type: "boolean",
      default: true,
      storageKey: "RnI6s_AuNzgo",
    },
    password: { type: "string", storageKey: "XbZs2aRa7mSc" },
    path: { type: "string", storageKey: "eIc8f5XKs5o0" },
    port: { type: "string", storageKey: "Zl7KwJcwLQCw" },
    requiresCaptcha: { type: "boolean", storageKey: "NPCbY4KviUoy" },
    requiresOTP: { type: "boolean", storageKey: "h5vJJJpwGJdI" },
    tags: { type: "string", storageKey: "tpsEChum15T1" },
    url: { type: "string", storageKey: "9MWOtuAVPSjH" },
    username: { type: "string", storageKey: "YH3obQ1mV_vg" },
  },
};
