import { expect, test } from "bun:test";
import sha1 from "./sha1";

const cases = {
  "": "da39a3ee5e6b4b0d3255bfef95601890afd80709",
  test: "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3",
  test2: "109f4b3c50d7b0df729d299bc6f8e9ef9066971f",
  test3: "3ebfa301dc59196f18593c45e519287a23297589",
};

for (const [str, hash] of Object.entries(cases)) {
  test(`sha1('${str}') === '${hash}'`, () => {
    const res = sha1(str);
    expect(res).toBe(hash);
  });
}
