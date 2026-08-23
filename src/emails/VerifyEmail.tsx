import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VerifyEmailProps {
  firstName: string;
  code: string;
}

export default function VerifyEmail({
  firstName,
  code,
}: VerifyEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>
        Confirma o teu email na Pleasure Shop
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
                lineHeight: "1.2",
                fontWeight: "700",
                color: "#18181b",
              }}
            >
              Olá, {firstName}!
            </Text>

            <Text
              style={{
                color: "#52525b",
                fontSize: "16px",
                lineHeight: "1.7",
              }}
            >
              Obrigado por criares uma conta
              na Pleasure Shop.
            </Text>

            <Text
              style={{
                color: "#52525b",
                fontSize: "16px",
                lineHeight: "1.7",
              }}
            >
              Para ativar a tua conta,
              introduz o seguinte código de
              verificação:
            </Text>

            <Section
              style={{
                marginTop: "30px",
                marginBottom: "30px",
                textAlign: "center",
              }}
            >
              <Text
                style={{
                  display: "inline-block",
                  margin: 0,
                  padding: "18px 30px",
                  backgroundColor:
                    "#ec4899",
                  borderRadius: "14px",
                  color: "#ffffff",
                  fontSize: "32px",
                  fontWeight: "700",
                  letterSpacing: "8px",
                }}
              >
                {code}
              </Text>
            </Section>

            <Text
              style={{
                color: "#71717a",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              Este código é válido durante
              15 minutos. Se não foste tu a
              criar esta conta, podes ignorar
              este email.
            </Text>

            <Hr
              style={{
                margin: "32px 0",
                borderColor: "#e4e4e7",
              }}
            />

            <Text
              style={{
                margin: 0,
                color: "#a1a1aa",
                fontSize: "12px",
                lineHeight: "1.6",
              }}
            >
              Este email foi enviado
              automaticamente pela Pleasure
              Shop. Por favor, não respondas
              diretamente a este email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}