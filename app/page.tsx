export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui", maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
      <h1>x402 Agent Toolkit</h1>
      <p>Paid utility endpoints for AI agents. Pay with USDC on Base or Solana.</p>
      <h2>Endpoints</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #333" }}>
            <th style={{ textAlign: "left", padding: "8px" }}>Endpoint</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Method</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Price</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["/api/url-to-text", "POST", "$0.02", "Scrape URL and extract clean text"],
            ["/api/json-transform", "POST", "$0.01", "Transform JSON: filter, pick, flatten"],
            ["/api/csv-parse", "POST", "$0.01", "Parse CSV to structured JSON"],
            ["/api/text-stats", "POST", "$0.005", "Word count, reading time, stats"],
            ["/api/hash-generate", "POST", "$0.005", "SHA256/MD5/SHA512 hash generation"],
          ].map(([path, method, price, desc]) => (
            <tr key={path} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "8px", fontFamily: "monospace" }}>{path}</td>
              <td style={{ padding: "8px" }}>{method}</td>
              <td style={{ padding: "8px" }}>{price}</td>
              <td style={{ padding: "8px" }}>{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 style={{ marginTop: "2rem" }}>Supported Networks</h2>
      <ul>
        <li>Base Mainnet (EVM) — USDC on chain ID 8453</li>
        <li>Solana Mainnet — USDC</li>
      </ul>
      <p style={{ marginTop: "2rem", color: "#666" }}>
        Discoverable on <a href="https://x402scan.com">x402scan.com</a>
      </p>
    </main>
  );
}
