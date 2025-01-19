import { ActionOptions } from "gadget-server";
import dns from "dns/promises";
import fetch from "node-fetch";

export const run = async ({ api, logger }) => {
  const BATCH_SIZE = 100;

  // Grab up to BATCH_SIZE records that need enrichment
  // api.BreachRecord.findMany returns a GadgetRecordList which extends Array
  let data;
  try {
    data = await api.BreachRecord.findMany({
      first: BATCH_SIZE,
      filter: {
        needsEnrichment: {
          equals: true,
        },
      },
    });
  } catch (err) {
    logger.error({ err }, "Failed to fetch records for enrichment");
    throw err;
  }

  if (data.length === 0) {
    logger.info("No records to enrich right now");
    if (data.hasNextPage) {
      logger.info("More records available in next page");
    }
    return "No records to enrich";
  }

  const updates = [];

  for (const record of data) {
    const {
      id,
      url,
    } = record;

    // defaults
    let domain = url;
    let port = "";
    let path = "";
    let ipAddress = "";
    let isResolved = false;
    let isAccessible = false;
    let httpTitle = "";
    let hasLoginForm = false;
    let requiresCaptcha = false;
    let requiresOTP = false;
    let domainParked = false;
    let domainRansomed = false;

    // parse URL
    let urlObj = null;
    try {
      urlObj = new URL(url);
      domain = urlObj.hostname;
      port = urlObj.port || "";
      path = urlObj.pathname || "";
    } catch (err) {
      // If it's not a valid URL, we just keep domain as whatever was in the file
    }

    // DNS resolution
    if (urlObj) {
      try {
        const addresses = await dns.lookup(domain);
        if (addresses && addresses.address) {
          ipAddress = addresses.address;
          isResolved = true;
        }
      } catch (err) {
        // no resolution
      }
    }

    // HTTP checks
    if (urlObj) {
      try {
        const res = await fetch(urlObj.toString(), { method: "GET", timeout: 5000 });
        isAccessible = res.ok;

        if (res.ok) {
          const html = await res.text();

          // <title> detection
          const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
          if (titleMatch) {
            httpTitle = titleMatch[1].trim();
          }

          // Detect login forms
          if (html.match(/<form[^>]+(password|login)/i)) {
            hasLoginForm = true;
            if (html.match(/captcha/i)) {
              requiresCaptcha = true;
            }
            if (html.match(/(otp|mfa)/i)) {
              requiresOTP = true;
            }
          }

          // Tag parked domains
          if (html.includes("domain is parked") || html.length < 2000) {
            domainParked = true;
          }

          // Tag ransomed
          if (html.includes("ransom") || html.includes("Encrypted by")) {
            domainRansomed = true;
          }
        }
      } catch (err) {
        // likely timed out or not accessible
      }
    }

    updates.push({
      id,
      domain,
      port,
      path,
      ipAddress,
      isResolved,
      isAccessible,
      httpTitle,
      hasLoginForm,
      requiresCaptcha,
      requiresOTP,
      domainParked,
      domainRansomed,
      needsEnrichment: false, // mark done
    });
  }

  // 6. Bulk update your records
  for (const update of updates) {
    await api.BreachRecord.update(update.id, update);
  }

  const msg = `Enriched ${updates.length} records.`;
  logger.info(msg);
  return msg;
};

export const options = {
  triggers: {
    api: true,
    scheduler: [
      {
        cron: "*/5 * * * *", // e.g. run every 5 minutes if you like
      },
    ],
  },
};