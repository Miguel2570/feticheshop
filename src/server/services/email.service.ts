import { render } from "@react-email/render";

import { resend, EMAIL_FROM } from "@/lib/resend";

import VerifyEmail from "@/emails/VerifyEmail";
import WelcomeEmail from "@/emails/WelcomeEmail";
import PasswordResetEmail from "@/emails/PasswordResetEmail";

interface SendVerificationEmailParams {
  email: string;
  firstName: string;
  code: string;
}

interface SendWelcomeEmailParams {
  email: string;
  firstName: string;
}

interface SendPasswordResetEmailParams {
  email: string;
  firstName: string;
  resetUrl: string;
}

export class EmailService {
  async sendVerificationEmail({
    email,
    firstName,
    code,
  }: SendVerificationEmailParams) {
    const html = await render(
      VerifyEmail({
        firstName,
        code,
      })
    );

    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject:
        "Confirma o teu email — Pleasure Shop",
      html,
    });

    if (result.error) {
      console.error(
        "Resend verification email error:",
        result.error
      );

      throw new Error(
        "Failed to send verification email."
      );
    }

    return result;
  }

  async sendWelcomeEmail({
    email,
    firstName,
  }: SendWelcomeEmailParams) {
    const html = await render(
      WelcomeEmail({
        firstName,
      })
    );

    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject:
        "Bem-vindo à Pleasure Shop 💗",
      html,
    });

    if (result.error) {
      console.error(
        "Resend welcome email error:",
        result.error
      );

      throw new Error(
        "Failed to send welcome email."
      );
    }

    return result;
  }

  async sendPasswordResetEmail({
    email,
    firstName,
    resetUrl,
  }: SendPasswordResetEmailParams) {
    const html = await render(
      PasswordResetEmail({
        firstName,
        resetUrl,
      })
    );

    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject:
        "Redefinir palavra-passe — Pleasure Shop",
      html,
    });

    if (result.error) {
      console.error(
        "Resend password reset email error:",
        result.error
      );

      throw new Error(
        "Failed to send password reset email."
      );
    }

    return result;
  }
}

export const emailService =
  new EmailService();