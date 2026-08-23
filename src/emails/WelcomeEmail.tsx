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

interface WelcomeEmailProps {
  firstName: string;
}

export default function WelcomeEmail({
  firstName,
}: WelcomeEmailProps) {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  return (
    <Html>
      <Head />

      <Preview>
        Bem-vindo à Pleasure Shop
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
                fontSize: "32px",
                lineHeight: "1.2",
                fontWeight: "700",
                color: "#18181b",
              }}
            >
              Bem-vindo, {firstName}! 💗
            </Text>

            <Text
              style={{
                color: "#52525b",
                fontSize: "16px",
                lineHeight: "1.7",
              }}
            >
              A tua conta foi confirmada
              com sucesso.
            </Text>

            <Text
              style={{
                color: "#52525b",
                fontSize: "16px",
                lineHeight: "1.7",
              }}
            >
              Agora já podes explorar a
              Pleasure Shop, guardar os teus
              produtos favoritos e acompanhar
              as tuas encomendas.
            </Text>

            <Section
              style={{
                marginTop: "32px",
                textAlign: "center",
              }}
            >
              <Button
                href={appUrl}
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
                Visitar Pleasure Shop
              </Button>
            </Section>

            <Text
              style={{
                marginTop: "35px",
                color: "#71717a",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              Obrigado por escolheres a
              Pleasure Shop.
            </Text>

            <Text
              style={{
                marginTop: "24px",
                color: "#a1a1aa",
                fontSize: "12px",
              }}
            >
              Pleasure Shop
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}