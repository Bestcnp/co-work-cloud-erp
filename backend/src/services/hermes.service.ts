/**
 * Hermes AI Service
 *
 * Wraps the Ollama API for Hermes 3 model interactions.
 * Provides content analysis and connectivity checks.
 */

import type { HermesResponse, HermesConnectionStatus } from '../models/index.js';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://host.docker.internal:11434';
const DEFAULT_MODEL = process.env.HERMES_MODEL || 'hermes3:8b';
const REQUEST_TIMEOUT = 30_000; // 30 seconds

export class HermesService {
  /**
   * Analyze content using Hermes AI.
   * Sends a prompt to the Ollama API and returns the model's response.
   */
  static async analyzeContent(
    prompt: string,
    model: string = DEFAULT_MODEL,
  ): Promise<HermesResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama API error (${response.status}): ${errorText}`);
      }

      const data = (await response.json()) as HermesResponse;
      return data;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error(`Hermes request timed out after ${REQUEST_TIMEOUT}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Check if Ollama is reachable and list available models.
   */
  static async checkConnection(): Promise<HermesConnectionStatus> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5_000);

      const response = await fetch(`${OLLAMA_HOST}/api/tags`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          connected: false,
          models: [],
          error: `Ollama returned status ${response.status}`,
        };
      }

      const data = (await response.json()) as { models: Array<{ name: string }> };
      const models = data.models?.map((m) => m.name) || [];

      return {
        connected: true,
        models,
      };
    } catch (error) {
      return {
        connected: false,
        models: [],
        error: error instanceof Error ? error.message : 'Unknown connection error',
      };
    }
  }
}
