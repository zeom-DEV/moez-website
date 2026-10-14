import { cp, access, mkdir } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const targets = ["assets", "CNAME", "robots.txt", "sitemap.xml", "404.html"];
await mkdir(join(root, "dist"), { recursive: true });
for (const name of targets) {
  try {
    await access(join(root, name));
    await cp(join(root, name), join(root, "dist", name), {
      recursive: true, force: true
    });
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}
