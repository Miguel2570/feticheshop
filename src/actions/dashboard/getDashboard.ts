"use server";

import { dashboardService } from "@/services/dashboard.service";

export async function getDashboard() {
  try {
    const dashboard =
      await dashboardService.getDashboard();

    return {
      success: true,
      data: dashboard,
    };
  } catch (error) {
    console.error(
      "[Dashboard]",
      error,
    );

    return {
      success: false,
      message:
        "Não foi possível carregar o Dashboard.",
      data: null,
    };
  }
}