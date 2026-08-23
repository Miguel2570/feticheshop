// Suprimir avisos de deprecation
process.env.NODE_NO_WARNINGS = "1";

import { spawn } from "node:child_process";
import { join } from "node:path";

function progress(percent: number, step: string) {
  console.log(
    JSON.stringify({
      type: "progress",
      progress: percent,
      step,
    })
  );
}

function log(message: string) {
  console.log(
    JSON.stringify({
      type: "log",
      message,
    })
  );
}

function runScript(
  script: string,
  progressValue: number,
  step: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    progress(progressValue, step);
    log(`🚀 ${step}`);

    const scriptPath = join(process.cwd(), "scripts", script);

    const isWindows = process.platform === "win32";

    let child;

    if (isWindows) {
      child = spawn(
        "npx.cmd",
        ["tsx", scriptPath],
        {
          env: {
            ...process.env,
          },
          stdio: ["ignore", "pipe", "pipe"],
          shell: true,
          windowsHide: true,
          cwd: process.cwd(),
        }
      );
    } else {
      child = spawn(
        "npx",
        ["tsx", scriptPath],
        {
          env: {
            ...process.env,
          },
          stdio: ["ignore", "pipe", "pipe"],
          cwd: process.cwd(),
        }
      );
    }

    child.stdout.on("data", (data) => {
      process.stdout.write(data);
    });

    child.stderr.on("data", (data) => {
      process.stderr.write(data);
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(`${script} terminou com código ${code}`)
        );
        return;
      }
      resolve();
    });
  });
}

async function main() {
  try {
    log("🚀 Iniciar sincronização Dreamlove");

    // 1. Categorias principais (frontend)
    await runScript(
      "sync-main-categories.ts",
      5,
      "Sincronizar categorias principais"
    );

    // 2. Categorias do fornecedor
    await runScript(
      "sync-dreamlove-categories.ts",
      15,
      "Sincronizar categorias"
    );

    // 3. Marcas
    await runScript(
      "sync-dreamlove-brands.ts",
      30,
      "Sincronizar marcas"
    );

    // 4. Produtos
    await runScript(
      "sync-dreamlove-products.ts",
      60,
      "Sincronizar produtos"
    );

    // 5. Stock/Preço
    await runScript(
      "sync-dreamlove-stock.ts",
      90,
      "Atualizar stock"
    );

    progress(100, "Sincronização concluída");

    console.log(
      JSON.stringify({
        type: "done",
      })
    );

    log("✅ Tudo concluído");
  } catch (error) {
    console.error(error);

    console.log(
      JSON.stringify({
        type: "error",
        message:
          error instanceof Error ? error.message : String(error),
      })
    );

    process.exitCode = 1;
  }
}

main();