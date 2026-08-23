import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface PasswordResetEmailProps {
  firstName: string;
  resetUrl: string;
}

export default function PasswordResetEmail({
  firstName,
  resetUrl,
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>
        Redefine a tua palavra-passe
      </Preview>

      <Body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#fafafa",
          fontFamily:
            "Arial, Helvetica, sans-serif",
          color: "#18181b",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "40px 24px",
          }}
        >
          <Section
            style={{
              backgroundColor: "#ffffff",
              border:
                "1px solid #e4e4e7",
              borderRadius: "24px",
              padding: "40px",
            }}
          >
            <Text
              style={{
                margin: 0,
                color: "#ec4899",
                fontSize: "14px",
                fontWeight: "700",
                letterSpacing: "2px",
                textTransform:
                  "uppercase",
              }}
            >
              Pleasure Shop
            </Text>

            <Text
              style={{
                marginTop: "28px",
                fontSize: "30px",
                fontWeight: "700",
                color: "#18181b",
              }}
            >
              Redefinir palavra-passe
            </Text>

            <Text
              style={{
                color: "#52525b",
                fontSize: "16px",
                lineHeight: "1.7",
              }}
            >
              Olá, {firstName}.
            </Text>

            <Text
              style={{
                color: "#52525b",
                fontSize: "16px",
                lineHeight: "1.7",
              }}
            >
              Recebemos um pedido para
              redefinir a palavra-passe da tua
              conta.
            </Text>

            <Section
              style={{
                marginTop: "32px",
                marginBottom: "32px",
                textAlign: "center",
              }}
            >
              <Button
                href={resetUrl}
                style={{
                  display: "inline-block",
                  padding:
                    "15px 28px",
                  backgroundColor:
                    "#ec4899",
                  borderRadius: "999px",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: "700",
                  textDecoration:
                    "none",
                }}
              >
                Redefinir palavra-passe
              </Button>
            </Section>

            <Text
              style={{
                color: "#71717a",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              Este link é válido durante 30
              minutos.
            </Text>

            <Text
              style={{
                color: "#71717a",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              Se não foste tu a fazer este
              pedido, podes ignorar este
              email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}