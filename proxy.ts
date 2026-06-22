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

export const proxy = paymentProxy(
  {
    "/api/url-to-text": {
      accepts: [
        { scheme: "exact" as const, price: "$0.02", network: EVM_NETWORK, payTo: WALLET_EVM },
        { scheme: "exact" as const, price: "$0.02", network: SVM_NETWORK, payTo: WALLET_SVM },
      ],
      description: "Scrape a URL and return clean text content.",
      mimeType: "application/json",
    },
    "/api/json-transform": {
      accepts: [
        { scheme: "exact" as const, price: "$0.01", network: EVM_NETWORK, payTo: WALLET_EVM },
        { scheme: "exact" as const, price: "$0.01", network: SVM_NETWORK, payTo: WALLET_SVM },
      ],
      description: "Transform JSON data: filter, pick, flatten, keys, count.",
      mimeType: "application/json",
    },
    "/api/csv-parse": {
      accepts: [
        { scheme: "exact" as const, price: "$0.01", network: EVM_NETWORK, payTo: WALLET_EVM },
        { scheme: "exact" as const, price: "$0.01", network: SVM_NETWORK, payTo: WALLET_SVM },
      ],
      description: "Parse CSV text into structured JSON.",
      mimeType: "application/json",
    },
    "/api/text-stats": {
      accepts: [
        { scheme: "exact" as const, price: "$0.005", network: EVM_NETWORK, payTo: WALLET_EVM },
        { scheme: "exact" as const, price: "$0.005", network: SVM_NETWORK, payTo: WALLET_SVM },
      ],
      description: "Get text statistics: word count, reading time, top words.",
      mimeType: "application/json",
    },
    "/api/hash-generate": {
      accepts: [
        { scheme: "exact" as const, price: "$0.005", network: EVM_NETWORK, payTo: WALLET_EVM },
        { scheme: "exact" as const, price: "$0.005", network: SVM_NETWORK, payTo: WALLET_SVM },
      ],
      description: "Generate SHA256/MD5/SHA512 hash from input string.",
      mimeType: "application/json",
    },
  },
  server,
);

export const config = { matcher: ["/api/:path*"] };
