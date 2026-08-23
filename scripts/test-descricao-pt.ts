// scripts/test-descricao-pt.ts
import "dotenv/config";

const API_URL = process.env.DREAMLOVE_API_URL;
const USERNAME = process.env.DREAMLOVE_USERNAME;
const PASSWORD = process.env.DREAMLOVE_PASSWORD;

async function testDescription() {
  // Login
  const loginRes = await fetch(`${API_URL}/login_check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
  });

  const loginData = await loginRes.json();
  const token = loginData.token;

  // Testar diferentes parâmetros
  const params = [
    "language=55",
    "lang=55",
    "locale=pt_PT",
    "lang=pt_PT",
    "language=pt_PT",
    "translation=55",
  ];

  for (const param of params) {
    const response = await fetch(`${API_URL}/products?page=1&${param}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    const firstProduct = Array.isArray(data) ? data[0] : data.member?.[0];

    if (firstProduct) {
      console.log(`\n=== ${param} ===`);
      console.log("Nome:", firstProduct.name);
      console.log("Descrição:", (firstProduct.description ?? firstProduct.longDescription ?? "SEM DESCRIÇÃO")?.substring(0, 200));
    }
  }
}

testDescription();