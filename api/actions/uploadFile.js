import { createInterface } from "node:readline";
import { Readable } from "node:stream";
import { URL } from "node:url";
import { assert } from "gadget-server";

/**
 * @typedef {Object} BreachRecordInput
 * @property {string} url
 * @property {string} username 
 * @property {string} password
 * @property {string} domain
 * @property {string} path
 * @property {string} port
 * @property {boolean} needsEnrichment
 */


class ProcessingError extends Error {
  constructor(type, message, details = {}) {
    super(message);
    this.type = type;
    this.details = details;
  }
}

/**
 * Validates a line from the input file and returns a parsed record
 * @throws {Error} If validation fails
 */
function validateAndParseLine(line, logger) {
  const parts = line.split(":");
  if (parts.length < 3) {
    throw new Error("Line must contain URL:username:password");
  }

  // The URL might contain colons, so we need to rejoin all parts except the last two
  const urlPart = parts.slice(0, -2).join(":");
  const username = parts[parts.length - 2];
  const password = parts[parts.length - 1];

  let parsedUrl;
  try {
    parsedUrl = new URL(urlPart);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new ProcessingError("validation", "URL must use http or https protocol", { urlPart });
    }
  } catch (err) {
    if (err instanceof ProcessingError) throw err;
    throw new ProcessingError("validation", `Invalid URL format: ${err.message}`, { urlPart });
  }

  if (!username?.trim()) {
    throw new Error("Username cannot be empty");
  }

  if (!password?.trim()) {
    throw new Error("Password cannot be empty");
  }

  /** @type {BreachRecordInput} */
  return {
    url: urlPart,
    username: username.trim(),
    password: password.trim(),
    domain: parsedUrl.hostname,
    path: parsedUrl.pathname,
    port: parsedUrl.port || "",
    needsEnrichment: true,
  };
}

/**
 * Processes a chunk of records by creating them in the DB.
 */
async function processBatch(records, api, logger) {
  const results = {
    successful: 0,
    failed: 0,
    errors: [],
  };

  logger.info({ batchSize: records.length }, "Processing batch");

  try {
    const createPromises = records.map(async (record) => {
      try {        
        await api.BreachRecord.create(record);
        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push({ url: record.url, error: error.message });
        logger.warn({ record, error: error.message }, "Failed to create record");
      }
    });

    await Promise.all(createPromises);
  } catch (error) {
    logger.error({ error, recordCount: records.length }, "Catastrophic chunk processing failure");
    results.failed += records.length;
  }

  logger.info(
    { successful: results.successful, failed: results.failed },
    "Batch processing complete"
  );
  
  return results;
}

export const run = async ({ params, api, logger }) => {
  // Statistics tracking
  const stats = {
    totalLines: 0,
    validLines: 0,
    invalidLines: 0,
    successfulRecords: 0,
    failedRecords: 0,
    errors: [],
  };

  const base64Data = assert(params.file, "No file param provided");
  const fileBuffer = Buffer.from(base64Data, "base64");
  const fileStream = new Readable();
  fileStream.push(fileBuffer);
  fileStream.push(null);

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const BATCH_SIZE = 1000;
  let chunk = [];
  let lastLoggedCount = 0;

  logger.info("Beginning file processing");

  for await (const line of rl) {
    stats.totalLines++;
    
    if (!line.trim()) {
      continue; // skip blank lines
    }

    try {
      const record = validateAndParseLine(line, logger);
      chunk.push(record);
      stats.validLines++;
    } catch (error) {
      stats.invalidLines++;
      if (error instanceof ProcessingError) {
        stats.errors.push({ line, ...error.details, message: error.message });
      } else {
        stats.errors.push({ line, error: error.message });
      }
      logger.warn({ line, error }, "Invalid line format");
      continue;
    }

    // Log progress every 1000 records
    if (stats.totalLines - lastLoggedCount >= 1000) {
      logger.info(
        { 
          totalLines: stats.totalLines,
          validLines: stats.validLines,
          invalidLines: stats.invalidLines,
        },
        "Processing progress"
      );
      lastLoggedCount = stats.totalLines;
    }

    if (chunk.length >= BATCH_SIZE) {
      const results = await processBatch(chunk, api, logger);
      stats.successfulRecords += results.successful;
      stats.failedRecords += results.failed;
      stats.errors.push(...results.errors);
      chunk = [];
    }
  }

  if (chunk.length > 0) {
    const results = await processBatch(chunk, api, logger);
    stats.successfulRecords += results.successful;
    stats.failedRecords += results.failed;
    stats.errors.push(...results.errors);
  }

  logger.info(
    {
      totalLines: stats.totalLines,
      validLines: stats.validLines,
      invalidLines: stats.invalidLines,
      successfulRecords: stats.successfulRecords,
      failedRecords: stats.failedRecords,
      errorCount: stats.errors.length,
    },
    "File processing complete"
  );

  return {
    success: true,
    result: stats,
  };
};

export const params = {
  file: {
    type: "string",
    format: "binary",
  }
};

export const options = {
  returnType: true,
  actionType: "custom",
  timeoutMS: 600000,
};
