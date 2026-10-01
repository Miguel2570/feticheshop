// scripts/sync-stock-manual.ts
import "dotenv/config";

import { syncStock } from "../src/lib/sync-stock";

async function main() {
  const result = await syncStock();

  console.log("\n═══════════════════════════════════════════");
  console.log("📊 RESULTADO FINAL");
  console.log("═══════════════════════════════════════════\n");
  console.log(JSON.stringify(result, null, 2));

  process.exit(result.success ? 0 : 1);
}

main().catch((err) => {
  console.error("❌ Erro fatal:", err);
  process.exit(1);
});