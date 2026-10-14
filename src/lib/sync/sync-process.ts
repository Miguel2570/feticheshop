import type { ChildProcess } from "node:child_process";

declare global {
  // eslint-disable-next-line no-var
  var dreamloveSyncProcess: ChildProcess | null | undefined;
}

export function getSyncProcess(): ChildProcess | null {
  return global.dreamloveSyncProcess ?? null;
}

export function setSyncProcess(
  process: ChildProcess | null
): void {
  global.dreamloveSyncProcess = process;
}

export function isSyncRunning(): boolean {
  const process = getSyncProcess();

  return process !== null && !process.killed;
}

export function clearSyncProcess(): void {
  global.dreamloveSyncProcess = null;
}