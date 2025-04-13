import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { updateMalaSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Reset the anonymous mala to ensure we're starting with the latest schema
  storage.resetAnonymousMala();

  // Get anonymous mala state
  app.get("/api/mala", async (_req, res) => {
    try {
      const mala = await storage.getAnonymousMala();
      res.json(mala);
    } catch (error) {
      res.status(500).json({ message: "Failed to get mala state" });
    }
  });

  // Update anonymous mala state
  app.post("/api/mala", async (req, res) => {
    try {
      const validationResult = updateMalaSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const updatedMala = await storage.updateAnonymousMala(validationResult.data);
      res.json(updatedMala);
    } catch (error) {
      res.status(500).json({ message: "Failed to update mala state" });
    }
  });

  // Schema for image upload validation
  const imageUploadSchema = z.object({
    deityId: z.string().min(1),
    imageDataUrl: z.string().min(5) // Base64 data URL
  });

  // Upload deity image
  app.post("/api/deityImage", async (req, res) => {
    try {
      const validationResult = imageUploadSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const { deityId, imageDataUrl } = validationResult.data;
      
      // Create an update object with the appropriate field name
      const updateData: any = {};
      
      // Map deity ID to the corresponding field name
      switch (deityId) {
        case 'amitabha':
          updateData.amitabhaImageUrl = imageDataUrl;
          break;
        case 'guru-rinpoche':
          updateData.guruRinpocheImageUrl = imageDataUrl;
          break;
        case 'green-tara':
          updateData.greenTaraImageUrl = imageDataUrl;
          break;
        case 'white-tara':
          updateData.whiteTaraImageUrl = imageDataUrl;
          break;
        case 'chenrezig':
          updateData.chenrezigImageUrl = imageDataUrl;
          break;
        case 'dzambhala':
          updateData.dzambhalaImageUrl = imageDataUrl;
          break;
        case 'shakyamuni':
          updateData.shakyamuniImageUrl = imageDataUrl;
          break;
        case 'medicine-buddha':
          updateData.medicineBuddhaImageUrl = imageDataUrl;
          break;
        case 'manjushri':
          updateData.manjushriImageUrl = imageDataUrl;
          break;
        case 'vajrasattva':
          updateData.vajrasattvaImageUrl = imageDataUrl;
          break;
        case 'confessions':
          updateData.confessionsImageUrl = imageDataUrl;
          break;
        default:
          return res.status(400).json({ message: "Invalid deity ID" });
      }
      
      // Update the mala with the new image URL
      const updatedMala = await storage.updateAnonymousMala(updateData);
      res.json({ success: true, mala: updatedMala });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });
  
  // Import mala data from backup
  app.post("/api/importData", async (req, res) => {
    try {
      // Validate the imported data has the expected structure
      const malaKeys = Object.keys(updateMalaSchema.shape);
      const validKeys = Object.keys(req.body).filter(key => malaKeys.includes(key));
      
      if (validKeys.length === 0) {
        return res.status(400).json({ message: "No valid mala data found in the import" });
      }
      
      // Create update object with only valid fields
      const updateData: any = {};
      validKeys.forEach(key => {
        updateData[key] = req.body[key];
      });
      
      // Update the mala with the imported data
      const updatedMala = await storage.updateAnonymousMala(updateData);
      res.json({ success: true, mala: updatedMala });
    } catch (error) {
      console.error("Error importing data:", error);
      res.status(500).json({ message: "Failed to import data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
