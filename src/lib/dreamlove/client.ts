// src/lib/dreamlove/client.ts

import soap from "soap";

// ═══════════════════════════════════════════════════════════════
// CONFIGURAÇÃO
// ═══════════════════════════════════════════════════════════════

const WSDL_URL =
  process.env.DREAMLOVE_WSDL_URL ??
  "https://store.dreamlove.es/webservices/orderservice_wsdl.php";

const ENDPOINT =
  process.env.DREAMLOVE_ENDPOINT ??
  "https://store.dreamlove.es/webservices/orderservice.php";

const USER = process.env.DREAMLOVE_USER ?? "";
const PASSWORD = process.env.DREAMLOVE_PASSWORD ?? "";

const AUTH_MODE = process.env.DREAMLOVE_AUTH_MODE ?? "basic";

if (!USER || !PASSWORD) {
  console.warn(
    "[Dreamlove] Credenciais em falta. Define DREAMLOVE_USER e DREAMLOVE_PASSWORD no .env"
  );
}

// ═══════════════════════════════════════════════════════════════
// TIPOS DA RESPOSTA
// ═══════════════════════════════════════════════════════════════

export interface OrderAccessInfo {
  status: number;
  orderId: string;
  gesioOrderId: string;
  errorCode: string;
  errorDescription: string;
}

export interface BasicProductInfo {
  status: number;
  productId: string;
  gesioProductId: string;
  name: string;
  available: boolean;
  availableStock: number;
  availableStockDisaggregated: string;
  cost_price: number;
  price: number;
  vat: number;
  variationsStock: string;
  updated: string;
  errorCode: string;
  errorDescription: string;
}

export interface BasicOrderInfo {
  status: number;
  orderId: string;
  gesioOrderId: string;
  orderStatus: string;
  name: string;
  updated: string;
  errorCode: string;
  errorDescription: string;
}

export interface JsonInfo {
  status: number;
  info: string;
  errorCode: string;
  errorDescription: string;
}

// ═══════════════════════════════════════════════════════════════
// CLIENTE SOAP
// ═══════════════════════════════════════════════════════════════

type SoapClient = soap.Client & {
  getSessionidAsync: (args: {
    a: string;
    b: string;
    resource: string;
  }) => Promise<[{ sessionInfo: { status: number; sessionid: string } }]>;

  closeSessionAsync: (args: {
    a: string;
    b: string;
    sessionid: string;
  }) => Promise<[{ status: number }]>;

  newOrderAsync: (args: {
    authmode: string;
    a: string;
    b: string;
    orderid: string;
    orderdata: string;
  }) => Promise<[{ orderAccessInfo: OrderAccessInfo }]>;

  newCustomerAsync: (args: {
    authmode: string;
    a: string;
    b: string;
    customerdata: string;
  }) => Promise<[{ customerAccessInfo: unknown }]>;

  searchCustomersAsync: (args: {
    authmode: string;
    a: string;
    b: string;
    searchQuery: string;
  }) => Promise<[{ searchCustomersInfo: unknown }]>;

  getBasicProductInfoAsync: (args: {
    authmode: string;
    a: string;
    b: string;
    resource: string;
    productid: string;
    stockinfodisaggregated: boolean;
    addvariationsstockinfo: boolean;
  }) => Promise<[{ basicProductInfo: BasicProductInfo }]>;

  getBasicOrderInfoAsync: (args: {
    authmode: string;
    a: string;
    b: string;
    orderid: string;
    orderidtype: string;
  }) => Promise<[{ basicOrderInfo: BasicOrderInfo }]>;

  chOrderStatusAsync: (args: {
    authmode: string;
    a: string;
    b: string;
    orderid: string;
    newstatus: string;
  }) => Promise<[{ orderAccessInfo: OrderAccessInfo }]>;

  getCatalogInfoAsync: (args: {
    authmode: string;
    a: string;
    b: string;
    mode: string;
    resource: string;
    minutessincelastsync: number;
    csvproductids: string;
  }) => Promise<[{ jsonInfo: JsonInfo }]>;

  getOrdersAsync: (args: {
    authmode: string;
    a: string;
    b: string;
    mode: string;
    minutessincelastsync: number;
    jsonextraparams: string;
  }) => Promise<[{ jsonInfo: JsonInfo }]>;
};

let cachedClient: SoapClient | null = null;

/**
 * Cria (ou devolve em cache) o cliente SOAP da Dreamlove.
 */
export async function getDreamloveClient(): Promise<SoapClient> {
  if (cachedClient) return cachedClient;

  const client = await soap.createClientAsync(WSDL_URL, {
    endpoint: ENDPOINT,
    forceSoap12Headers: false,
  });

  cachedClient = client as unknown as SoapClient;
  return cachedClient;
}

// ═══════════════════════════════════════════════════════════════
// HELPERS PÚBLICOS
// ═══════════════════════════════════════════════════════════════

/**
 * Cria um pedido de dropshipping na Dreamlove.
 *
 * @param orderId   ID do pedido no teu sistema (ex: "ORD-2026-0001")
 * @param orderData XML completo com os dados do pedido (formato definido pela Dreamlove)
 */
export async function createOrder(
  orderId: string,
  orderData: string
): Promise<OrderAccessInfo> {
  const client = await getDreamloveClient();

  const [response] = await client.newOrderAsync({
    authmode: AUTH_MODE,
    a: USER,
    b: PASSWORD,
    orderid: orderId,
    orderdata: orderData,
  });

  return response.orderAccessInfo;
}

/**
 * Consulta o estado de um pedido já criado.
 *
 * @param orderId       ID do pedido (na Dreamlove ou no teu sistema)
 * @param orderIdType   "gesio" | "order" (conforme o WSDL)
 */
export async function getOrderInfo(
  orderId: string,
  orderIdType: "gesio" | "order" = "gesio"
): Promise<BasicOrderInfo> {
  const client = await getDreamloveClient();

  const [response] = await client.getBasicOrderInfoAsync({
    authmode: AUTH_MODE,
    a: USER,
    b: PASSWORD,
    orderid: orderId,
    orderidtype: orderIdType,
  });

  return response.basicOrderInfo;
}

/**
 * Consulta informação de um produto (stock, preço, custo).
 *
 * @param productId   SKU ou ID do produto
 */
export async function getProductInfo(
  productId: string
): Promise<BasicProductInfo> {
  const client = await getDreamloveClient();

  const [response] = await client.getBasicProductInfoAsync({
    authmode: AUTH_MODE,
    a: USER,
    b: PASSWORD,
    resource: "std",
    productid: productId,
    stockinfodisaggregated: false,
    addvariationsstockinfo: false,
  });

  return response.basicProductInfo;
}

/**
 * Altera o estado de um pedido.
 *
 * @param orderId    ID do pedido
 * @param newStatus  Novo estado (ver valores aceites com a Dreamlove)
 */
export async function changeOrderStatus(
  orderId: string,
  newStatus: string
): Promise<OrderAccessInfo> {
  const client = await getDreamloveClient();

  const [response] = await client.chOrderStatusAsync({
    authmode: AUTH_MODE,
    a: USER,
    b: PASSWORD,
    orderid: orderId,
    newstatus: newStatus,
  });

  return response.orderAccessInfo;
}

/**
 * Obtém o catálogo de produtos (sync).
 *
 * @param minutesSinceLastSync  0 = tudo; >0 = só alterações desde X minutos
 * @param productIdsCsv         IDs específicos, ou "" para todos
 */
export async function getCatalog(
  minutesSinceLastSync = 0,
  productIdsCsv = ""
): Promise<JsonInfo> {
  const client = await getDreamloveClient();

  const [response] = await client.getCatalogInfoAsync({
    authmode: AUTH_MODE,
    a: USER,
    b: PASSWORD,
    mode: "std",
    resource: "std",
    minutessincelastsync: minutesSinceLastSync,
    csvproductids: productIdsCsv,
  });

  return response.jsonInfo;
}

/**
 * Lista pedidos existentes (com filtros opcionais).
 */
export async function getOrders(
  minutesSinceLastSync = 0,
  extraParams = ""
): Promise<JsonInfo> {
  const client = await getDreamloveClient();

  const [response] = await client.getOrdersAsync({
    authmode: AUTH_MODE,
    a: USER,
    b: PASSWORD,
    mode: "std",
    minutessincelastsync: minutesSinceLastSync,
    jsonextraparams: extraParams,
  });

  return response.jsonInfo;
}