// Sets up the API client for interacting with your backend. 
// For your API reference, visit: https://docs.gadget.dev/api/hackbibis
import { Client } from "@gadget-client/hackbibis";

export const api = new Client({ environment: window.gadgetConfig.environment });
