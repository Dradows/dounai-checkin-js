import test from "node:test";
import assert from "node:assert/strict";

import { parseSetCookie, serializeCookie } from "../src/cookie.js";

test("parseSetCookie extracts login cookies", () => {
  const cookie = parseSetCookie([
    "uid=123; path=/; HttpOnly",
    "key=abc; path=/; HttpOnly",
    "email=user@example.com; path=/",
    "ip=127.0.0.1; path=/",
    "expire_in=1893456000; path=/"
  ]);

  assert.deepEqual(cookie, {
    uid: "123",
    key: "abc",
    email: "user@example.com",
    ip: "127.0.0.1",
    expireIn: 1893456000
  });
});

test("serializeCookie builds request cookie header", () => {
  const header = serializeCookie({
    uid: "123",
    key: "abc",
    email: "user@example.com",
    ip: "127.0.0.1",
    expireIn: 1893456000
  });

  assert.equal(
    header,
    "uid=123; ip=127.0.0.1; key=abc; email=user%40example.com; expire_in=1893456000"
  );
});
