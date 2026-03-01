import type { Express } from "express";
import { createServer, type Server } from "http";
import { api, errorSchemas } from "@shared/routes";
import { fetchProduct } from "./services/openfoodfacts";
import { analyzeProduct } from "./services/analyzer";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.scan.process.path, async (req, res) => {
    try {
      const input = api.scan.process.input.parse(req.body);
      const product = await fetchProduct(input.barcode);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found or invalid barcode" });
      }

      const result = analyzeProduct(product, input.profile);
      res.status(200).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
