const { validateMessage } = require("../utils");

test("valida mensagem válida", () => {
  const msg = { user: "Ana", message: "Oi" };
  expect(validateMessage(msg)).toBe(true);
});

test("falha sem usuário", () => {
  expect(validateMessage({ user: "", message: "Oi" })).toBe(false);
});

test("falha sem mensagem", () => {
  expect(validateMessage({ user: "Ana", message: "" })).toBe(false);
});
