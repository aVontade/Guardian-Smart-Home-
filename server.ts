import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini Setup
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/insights", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.json({ 
          insight: "Gemini API key is not configured. Local security mode active.",
          suggestion: "Connect to cloud for AI-enhanced monitoring."
        });
      }

      const { status, events } = req.body;
      
      const prompt = `You are an advanced AI home security consultant. 
      Current System Status: ${status}
      Recent Events: ${JSON.stringify(events)}
      
      Provide a brief, professional security insight and one smart suggestion for the user.
      Keep it concise and high-end.
      
      Format response as JSON: { "insight": "...", "suggestion": "..." }`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text || "{}");
      res.json(data);
    } catch (error) {
      console.error("AI Insights Error:", error);
      res.status(500).json({ error: "Failed to generate insights" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();