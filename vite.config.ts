import { defineConfig } from "vite";
import { gadget } from "gadget-server/vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [
    // The gadget plugin must come first to properly configure the environment
    gadget(),
    // Configure react-swc for optimal React build performance
    react(),
  ],
  // Prevent Vite from clearing the terminal so build messages are preserved
  clearScreen: false,
  // Ensure proper HTML/assets serving from /
  base: "/",
});
