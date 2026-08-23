const API_URL = process.env.SUPPLIER_API_URL!;
const API_KEY = process.env.SUPPLIER_API_KEY!;

export async function supplierFetch<T>(
  endpoint: string
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Supplier API: ${response.status}`
    );
  }

  return response.json();
}