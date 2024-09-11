import path from "node:path";

const __dirname = path.dirname(import.meta.dirname);

/** @type {import("next").NextConfig} */
const config = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};

export default config;
