import { paymentProxy } from "@x402/next";
import { x402ResourceServer, HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";

const WALLET_EVM = process.env.EVM_ADDRESS;
const FACILITATOR_URL = process.env.FACILITATOR_URL;

if (!WALLET_EVM || !FACILITATOR_URL) {
  throw new Error("Missing required env vars: EVM_ADDRESS, FACILITATOR_URL");
}

const EVM_NETWORK = "eip155:8453" as const;

const facilitatorClient = new HTTPFacilitatorClient({ url: FACILITATOR_URL });
const server = new x402ResourceServer(facilitatorClient);
server.register(EVM_NETWORK, new ExactEvmScheme());

const evmPayTo = { scheme: "exact" as const, price: "$0.02", network: EVM_NETWORK, payTo: WALLET_EVM };

export const proxy = paymentProxy(
  {
    "/api/url-to-text": {
      accepts: [
        { ...evmPayTo, price: "$0.02" }],
      description: "Scrape a URL and return clean text content. Supports articles, docs, and web pages.",
      mimeType: "application/json",
    },
    "/api/json-transform": {
      accepts: [
        { ...evmPayTo, price: "$0.01" }],
      description: "Transform JSON data: filter keys, pick fields, flatten nested objects, or apply jq-style queries.",
      mimeType: "application/json",
    },
    "/api/csv-parse": {
      accepts: [
        { ...evmPayTo, price: "$0.01" }],
      description: "Parse CSV text into structured JSON with auto-detected delimiters and headers.",
      mimeType: "application/json",
    },
    "/api/text-stats": {
      accepts: [
        { ...evmPayTo, price: "$0.005" }],
      description: "Get text statistics: word count, character count, sentence count, reading time, and more.",
      mimeType: "application/json",
    },
    "/api/hash-generate": {
      accepts: [
        { ...evmPayTo, price: "$0.005" }],
      description: "Generate cryptographic hashes (SHA256, MD5, SHA512) from any input string.",
      mimeType: "application/json",
    },
  },
  server,
);

export const config = { matcher: ["/api/:path*"] };
