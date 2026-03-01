import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type ScanRequest, type ScanResponse } from "@shared/schema";
import { z } from "zod";
import { getProfile } from "@/utils/profile";

const API_BASE = import.meta.env.VITE_API_URL || "";

export function useScanBarcode() {
  return useMutation({
    mutationFn: async (data: ScanRequest): Promise<ScanResponse> => {
      // Validate input before sending
      const validatedInput = api.scan.process.input.parse({ ...data, profile: getProfile() ?? undefined });
      
      const res = await fetch(`${API_BASE}${api.scan.process.path}`, {
        method: api.scan.process.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedInput),
      });

      if (!res.ok) {
        if (res.status === 404) {
          const contentType = res.headers.get("content-type") || "";

          if (contentType.includes("application/json")) {
            const error = api.scan.process.responses[404].parse(await res.json());
            throw new Error(error.message);
          }

          throw new Error("Scanner API endpoint not found. Check VITE_API_URL deployment config.");
        }
        if (res.status === 400) {
          const error = api.scan.process.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("An error occurred while analyzing the product.");
      }

      // Validate and return response
      const rawData = await res.json();
      return api.scan.process.responses[200].parse(rawData);
    }
  });
}
