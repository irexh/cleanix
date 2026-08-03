import type {NextConfig} from "next";
import createNextIntlPlugin from "next-intl/plugin";
import {dirname} from "node:path";
import {fileURLToPath} from "node:url";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: projectRoot
  }
};

export default withNextIntl(nextConfig);
