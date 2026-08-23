import { NextResponse } from "next/server";

import {
  clearSyncProcess,
  getSyncProcess,
} from "@/lib/sync-process";

import { syncEmitter } from "@/lib/sync-emitter";

export async function POST() {
  const child = getSyncProcess();

  if (!child) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Não existe nenhuma sincronização em execução.",
      },
      {
        status: 404,
      }
    );
  }

  try {
    syncEmitter.emit("message", {
      type: "log",
      message:
        "⚠️ Cancelamento da sincronização solicitado...",
    });

    /*
     * Como estás a usar shell: true, no Windows
     * precisamos de terminar a árvore de processos.
     */

    if (process.platform === "win32") {
      const { exec } = await import(
        "node:child_process"
      );

      exec(
        `taskkill /pid ${child.pid} /T /F`,
        (error) => {
          if (error) {
            console.error(
              "Erro ao terminar sincronização:",
              error
            );
          }
        }
      );
    } else {
      child.kill("SIGTERM");
    }

    clearSyncProcess();

    syncEmitter.emit("message", {
      type: "cancelled",
      message:
        "Sincronização cancelada pelo utilizador.",
    });

    return NextResponse.json({
      success: true,
      message: "Sincronização cancelada.",
    });
  } catch (error) {
    console.error(
      "Erro ao cancelar sincronização:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Não foi possível cancelar a sincronização.",
      },
      {
        status: 500,
      }
    );
  }
}