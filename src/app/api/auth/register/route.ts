import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  authService,
} from "@/server/services/auth.service";

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const result =
      await authService.register({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
      });

    return NextResponse.json(
      {
        success: true,
        user: result.user,
        message:
          "Conta criada com sucesso.",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    if (
      error instanceof Error &&
      error.message ===
        "EMAIL_ALREADY_EXISTS"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Já existe uma conta com este email.",
        },
        {
          status: 409,
        }
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "INVALID_DATA"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Preenche todos os campos corretamente.",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Não foi possível criar a conta.",
      },
      {
        status: 500,
      }
    );
  }
}