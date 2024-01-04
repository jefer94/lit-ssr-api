import fs from "fs";
import path from "path";
import sha1 from "./sha1";
import writeFile from "./writeFile";

const cache = new Map<string, any>();
const tmpPath = "./tmp";

if (!fs.existsSync(tmpPath)) {
  fs.mkdirSync(tmpPath, 744);
}

export default async function loadModule(
  dependency: string,
  ext: string = "ts"
): Promise<any> {
  const hash = sha1(dependency);

  // cache.
  if (cache.has(hash)) {
    return cache.get(hash);
  }

  const filePath = path.resolve(import.meta.dir, `../tmp/${hash}.${ext}`);
  await writeFile(filePath, dependency);

  const module = await import(filePath);
  cache.set(hash, module);

  return module;
}
