import fs from "fs";

export default async function readFile(
  path: fs.PathOrFileDescriptor
): Promise<string> {
  const { promise, resolve, reject } = Promise.withResolvers<string>();
  fs.readFile(path, { encoding: "utf-8" }, (err, data) => {
    if (err) reject(err);
    resolve(data);
  });
  return promise;
}
