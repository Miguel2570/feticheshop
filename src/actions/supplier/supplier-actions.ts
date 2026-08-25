"use server";

import { spawn } from "node:child_process";

import { syncEmitter } from "@/lib/sync-emitter";

export async function syncDreamlove(): Promise<void> {
  return new Promise((resolve, reject) => {
    syncEmitter.emit("message", {
      type: "progress",
      progress: 0,
      step: "A iniciar sincronização...",
    });

    const child = spawn(
      "npx",
      ["tsx", "scripts/sync-dreamlove.ts"],
      {
        shell: true,
        env: process.env,
      }
    );

    let stdoutBuffer = "";
    let stderrBuffer = "";

    child.stdout.on("data", (data) => {
      stdoutBuffer += data.toString();

      const lines = stdoutBuffer.split("\n");

      stdoutBuffer = lines.pop() ?? "";

      for (const line of lines) {
        processLine(line);
      }
    });

    child.stderr.on("data", (data) => {
      stderrBuffer += data.toString();

      const lines = stderrBuffer.split("\n");

      stderrBuffer = lines.pop() ?? "";

      for (const line of lines) {
        const message = line.trim();

        if (!message) continue;

        console.error(message);

        syncEmitter.emit("message", {
          type: "error",
          message,
        });
      }
    });

    child.on("error", (error) => {
      syncEmitter.emit("message", {
        type: "error",
        message: error.message,
      });

      reject(error);
    });

    child.on("close", (code) => {
      if (stdoutBuffer.trim()) {
        processLine(stdoutBuffer);
      }

      if (stderrBuffer.trim()) {
        syncEmitter.emit("message", {
          type: "error",
          message: stderrBuffer.trim(),
        });
      }

      if (code !== 0) {
        const error = new Error(
          `Processo terminou com código ${code}`
        );

        syncEmitter.emit("message", {
          type: "error",
          message: error.message,
        });

        reject(error);
        return;
      }

      resolve();
    });

    function processLine(line: string) {
      const text = line.trim();

      if (!text) return;

      console.log(text);

      try {
        const event = JSON.parse(text);

        syncEmitter.emit("message", event);
      } catch {
        syncEmitter.emit("message", {
          type: "log",
          message: text,
        });
      }
    }
  });
}