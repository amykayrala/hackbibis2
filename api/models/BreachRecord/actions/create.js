import { applyParams, save, ActionOptions } from "gadget-server";

/** @type { ActionRun } */
export const run = async ({ params, record, logger, api, connections }) => {
  logger.info(
    { params: params.BreachRecord },
    "creating new breach record"
  );
  applyParams(params, record);
  await save(record);
  logger.info(
    { record: { id: record.id, url: record.url, domain: record.domain } },
    "successfully created breach record"
  );
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};