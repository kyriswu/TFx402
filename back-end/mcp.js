import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

// --- 2. Tool 定义 ---
const toolsDefinition = [
  {
    name: "pay",
    description: "Execute a payment transaction",
    inputSchema: z.object({
      amount: z.number().describe("The amount of money to pay"),
      currency: z.string().default("USD").describe("Currency code (e.g. USD, CNY)")
    }),
    handler: async ({ amount, currency }) => {
      console.log(`Processing payment: ${amount} ${currency}`);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ success: true, amount, currency, status: "processing" }),
          },
          // {
          //   type: "image",
          //   url: "https://cdn.docsmall.com/assets/img/jpg-after.aa258f3.jpg",
          // }
        ],
      };
    }
  },
  {
    name: "poll_payment_status",
    description: "Poll transaction status by trx_id until confirmed, failed, or timeout after 3 minutes",
    inputSchema: z.object({
      trx_id: z.string().describe("Transaction ID to poll")
    }),
    handler: async ({ trx_id }) => {
      const maxDuration = 3 * 60 * 1000; // 3 minutes
      const pollInterval = 3000; // 3 seconds
      const startTime = Date.now();

      const { getTransactionInfo } = await import("./wallet.js");

      while (Date.now() - startTime < maxDuration) {
        try {
          const result = await getTransactionInfo(trx_id);
          if (result) {
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({ success: true, trx_id, status: "confirmed", data: result })
                }
              ]
            };
          }
        } catch (e) {
          console.error(`Poll error for ${trx_id}:`, e);
        }

        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ success: false, trx_id, status: "timeout", message: "Transaction status check timed out after 3 minutes" })
          }
        ]
      };
    }
  }
];

async function generateManifest() {
  const manifest = {
    server: {
      name: "express-mcp",
      version: "1.0.0",
    },
    tools: toolsDefinition.map(t => ({
      name: t.name,
      description: t.description,
      inputSchema: zodToJsonSchema(t.inputSchema)
    }))
  };

  const filePath = path.join(process.cwd(), "mcp-manifest.json");
  fs.writeFileSync(filePath, JSON.stringify(manifest, null, 2));
  console.log(`✅ JSON description file generated at: ${filePath}`);
}

async function main() {
  const server = new McpServer({
    name: "express-mcp",
    version: "1.0.0",
  });

  // --- 3. 循环注册 Tool ---
  for (const tool of toolsDefinition) {
    server.registerTool(
      tool.name,
      {
        description: tool.description,
        inputSchema: tool.inputSchema,
      },
      tool.handler
    );
  }

  await generateManifest();

  // --- 4. 启动 SSE 服务器 ---
  const app = express();
  const port = 5005;

  app.use(cors());
  app.use(express.json({ limit: "4mb" }));

  const transports = new Map();

  // --- 端点 1: 建立 SSE 连接 (GET) ---
  app.get("/sse", async (req, res) => {
    console.log("-> New SSE connection request");

    const transport = new SSEServerTransport("/messages", res);

    try {
      await server.connect(transport);
      transports.set(transport.sessionId, transport);
    } catch (err) {
      console.error("Error connecting client:", err);
      res.status(500).end("Failed to connect SSE transport");
      return;
    }

    res.on("close", () => {
      transports.delete(transport.sessionId);
    });
  });

  // --- 端点 2: 接收客户端指令 (POST) ---
  app.post("/messages", async (req, res) => {
    const sessionId = req.query.sessionId;

    if (typeof sessionId !== "string") {
      res.status(400).send("Missing sessionId");
      return;
    }

    const transport = transports.get(sessionId);

    if (!transport) {
      res.status(404).send("Session not found (Please connect to /sse first)");
      return;
    }

    try {
      await transport.handlePostMessage(req, res, req.body);
    } catch (err) {
      console.error("Error handling message:", err);
      if (!res.headersSent) {
        res.status(400).send("Invalid message");
      }
    }
  });

  app.listen(port, "0.0.0.0", () => {
    console.log(`✅ MCP SSE Server running on http://localhost:${port}/sse`);
    console.log("   (Use this URL in Cherry Studio or your MCP Client)");
  });
}

main().catch((err) => {
  console.error("Failed to start MCP:", err);
  process.exit(1);
});