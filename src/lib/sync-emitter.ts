import { EventEmitter } from "node:events";

export const syncEmitter = new EventEmitter();

syncEmitter.setMaxListeners(100);