// scripts/test-traducoes.ts
import "dotenv/config";

const API_URL = process.env.DREAMLOVE_API_URL;
const USERNAME = process.env.DREAMLOVE_USERNAME;
const PASSWORD = process.env.DREAMLOVE_PASSWORD;

async function testTranslations() {
  // Login
  const loginRes = await fetch(`${API_URL}/login_check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
  });

  const loginData = await loginRes.json();
  const token = loginData.token;

  // Testar product_translations
  console.log("=== product_translations ===");
  const transRes = await fetch(`${API_URL}/product_translations?page=1&limit=5`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const transText = await transRes.text();
  console.log("Status:", transRes.status);
  console.log(transText.substring(0, 3000));

  // Testar produto individual
  console.log("\n=== Produto individual ===");
  const productRes = await fetch(`${API_URL}/products/1`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const productText = await productRes.text();
  console.log("Status:", productRes.status);
  console.log(productText.substring(0, 3000));
}

testTranslations();