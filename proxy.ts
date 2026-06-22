import { paymentProxy } from "@x402/next";
import { x402ResourceServer, HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { ExactSvmScheme } from "@x402/svm/exact/server";

const WALLET_EVM = process.env.EVM_ADDRESS;
const WALLET_SVM = process.env.SVM_ADDRESS;
const FACILITATOR_URL = process.env.FACILITATOR_URL;

if (!WALLET_EVM || !WALLET_SVM || !FACILITATOR_URL) {
  throw new Error("Missing required env vars: EVM_ADDRESS, SVM_ADDRESS, FACILITATOR_URL");
}

const EVM_NETWORK = "eip155:8453" as const;
const SVM_NETWORK = "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp" as const;

const facilitatorClient = new HTTPFacilitatorClient({ url: FACILITATOR_URL });
const server = new x402ResourceServer(facilitatorClient);
server.register(EVM_NETWORK, new ExactEvmScheme());
server.register(SVM_NETWORK, new ExactSvmScheme());

const evmPayTo = { scheme: "exact" as const, price: "$0.02", network: EVM_NETWORK, payTo: WALLET_EVM };
const svmPayTo = { scheme: "exact" as const, price: "$0.02", network: SVM_NETWORK, payTo: WALLET_SVM };

export const proxy = paymentProxy(
  {
    "/api/info": {
      accepts: [
        { scheme: "exact", price: "$0.001", network: EVM_NETWORK, payTo: WALLET_EVM },
        { scheme: "exact", price: "$0.001", network: SVM_NETWORK, payTo: WALLET_SVM },
      ],
      description: "API info and endpoint listing.",
      mimeType: "application/json",
    },
    "/api/url-to-text": {
      accepts: [
        { ...evmPayTo, price: "$0.02" },
        { ...svmPayTo, price: "$0.02" },
      ],
      description: "Scrape a URL and return clean text content. Supports articles, docs, and web pages.",
      mimeType: "application/json",
    },
    "/api/json-transform": {
      accepts: [
        { ...evmPayTo, price: "$0.01" },
        { ...svmPayTo, price: "$0.01" },
      ],
      description: "Transform JSON data: filter keys, pick fields, flatten nested objects, or apply jq-style queries.",
      mimeType: "application/json",
    },
    "/api/csv-parse": {
      accepts: [
        { ...evmPayTo, price: "$0.01" },
        { ...svmPayTo, price: "$0.01" },
      ],
      description: "Parse CSV text into structured JSON with auto-detected delimiters and headers.",
      mimeType: "application/json",
    },
    "/api/text-stats": {
      accepts: [
        { ...evmPayTo, price: "$0.005" },
        { ...svmPayTo, price: "$0.005" },
      ],
      description: "Get text statistics: word count, character count, sentence count, reading time, and more.",
      mimeType: "application/json",
    },
    "/api/hash-generate": {
      accepts: [
        { ...evmPayTo, price: "$0.005" },
        { ...svmPayTo, price: "$0.005" },
      ],
      description: "Generate cryptographic hashes (SHA256, MD5, SHA512) from any input string.",
      mimeType: "application/json",
    },
  },
  server,
);

export const config = { matcher: ["/api/:path*"] };
