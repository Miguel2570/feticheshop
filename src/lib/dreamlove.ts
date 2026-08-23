const API_URL = process.env.DREAMLOVE_API_URL!;
const USERNAME = process.env.DREAMLOVE_USERNAME!;
const PASSWORD = process.env.DREAMLOVE_PASSWORD!;

interface LoginResponse {
  token: string;
}

export async function getDreamloveToken(): Promise<string> {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: USERNAME,
      password: PASSWORD,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Dreamlove login failed: ${error}`);
  }

  const data: LoginResponse = await response.json();

  return data.token;
}


export async function getDreamloveProducts() {
  const token = await getDreamloveToken();

  const response = await fetch(
    `${API_URL}/products?page=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/ld+json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Dreamlove products failed: ${error}`);
  }

  return response.json();
}