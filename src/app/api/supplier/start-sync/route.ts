import { NextResponse } from "next/server";

import {
  syncDreamlove,
} from "@/actions/supplier/supplier-actions";

let running = false;

export async function POST() {
  if (running) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Já existe uma sincronização em execução.",
      },
      {
        status: 409,
      }
    );
  }

  running = true;

  syncDreamlove()
    .catch((error) => {
      console.error(
        "Erro na sincronização Dreamlove:",
        error
      );
    })
    .finally(() => {
      running = false;
    });

  return NextResponse.json({
    success: true,
    message:
      "Sincronização iniciada.",
  });
}