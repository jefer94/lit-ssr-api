import fs from "fs";

export default async function writeFile(
  path: fs.PathOrFileDescriptor,
  data: string
): Promise<void> {
  const { promise, resolve, reject } = Promise.withResolvers<void>();
  fs.writeFile(path, data, (err) => {
    if (err) reject(err);
    resolve();
  });
  return promise;
}
