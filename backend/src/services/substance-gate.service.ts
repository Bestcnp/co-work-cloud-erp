/**
 * Substance Gate Service
 *
 * Uses Hermes AI to classify products for controlled substance categories.
 * Enforces Thai regulatory restrictions based on the classification.
 */

import { HermesService } from './hermes.service.js';
import type { ControlledSubstanceCategory } from '../models/index.js';

export interface SubstanceCheckResult {
  category: ControlledSubstanceCategory;
  confidence: number;
  reasoning: string;
  requiresRestriction: boolean;
}

interface HermesSubstanceResponse {
  category: ControlledSubstanceCategory;
  confidence: number;
  reasoning: string;
}

const VALID_CATEGORIES: ReadonlySet<ControlledSubstanceCategory> = new Set([
  'NONE',
  'ALCOHOL',
  'TOBACCO',
  'CANNABIS_THC',
  'NARCOTICS',
]);

const SUBSTANCE_SYSTEM_PROMPT = `You are a product compliance classifier for a Thai ERP system.
Analyze the product and classify it into EXACTLY ONE of these categories:
- NONE: Not a controlled substance
- ALCOHOL: Alcoholic beverages or products containing alcohol for consumption
- TOBACCO: Cigarettes, cigars, vaping products, e-cigarettes, nicotine products
- CANNABIS_THC: Products containing THC, marijuana, cannabis extracts
- NARCOTICS: Illegal drugs, controlled narcotics, prescription-only substances

Respond ONLY with valid JSON in this exact format:
{"category": "NONE", "confidence": 0.95, "reasoning": "Brief explanation"}

Rules:
- confidence must be between 0.0 and 1.0
- category must be exactly one of: NONE, ALCOHOL, TOBACCO, CANNABIS_THC, NARCOTICS
- Be conservative: if unsure, use a lower confidence score
- Consider the Thai regulatory context`;

export class SubstanceGateService {
  /**
   * Classify a product using Hermes AI to detect controlled substances.
   */
  static async classifyProduct(
    productName: string,
    description: string,
    brandName?: string,
  ): Promise<SubstanceCheckResult> {
    const productInfo = [
      `Product Name: ${productName}`,
      `Description: ${description}`,
      brandName ? `Brand: ${brandName}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const prompt = `${SUBSTANCE_SYSTEM_PROMPT}\n\nProduct to classify:\n${productInfo}`;

    try {
      const hermesResponse = await HermesService.analyzeContent(prompt);
      const parsed = SubstanceGateService.parseResponse(hermesResponse.response);

      return {
        category: parsed.category,
        confidence: parsed.confidence,
        reasoning: parsed.reasoning,
        requiresRestriction: SubstanceGateService.isRestricted(parsed.category),
      };
    } catch (error) {
      console.error('[SubstanceGate] Classification failed:', error);
      // Fail safe — flag for manual review with low confidence
      return {
        category: 'NONE',
        confidence: 0,
        reasoning: 'Classification failed — requires manual review',
        requiresRestriction: false,
      };
    }
  }

  /**
   * Parse the raw Hermes response into a structured substance classification.
   */
  private static parseResponse(raw: string): HermesSubstanceResponse {
    // Extract JSON from the response (Hermes may wrap it in markdown fences)
    const jsonMatch = raw.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) {
      throw new Error('No JSON object found in Hermes response');
    }

    const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;

    const category = String(parsed.category ?? 'NONE') as ControlledSubstanceCategory;
    const confidence = Number(parsed.confidence ?? 0);
    const reasoning = String(parsed.reasoning ?? '');

    // Validate category
    if (!VALID_CATEGORIES.has(category)) {
      throw new Error(`Invalid substance category: ${category}`);
    }

    // Clamp confidence to [0, 1]
    const clampedConfidence = Math.max(0, Math.min(1, confidence));

    return { category, confidence: clampedConfidence, reasoning };
  }

  /**
   * Check if a substance category requires any restrictions.
   */
  static isRestricted(category: ControlledSubstanceCategory): boolean {
    return category !== 'NONE';
  }

  /**
   * Get the restriction rules for a given substance category.
   * Rules follow Thai regulatory framework.
   */
  static getRestrictionRules(category: ControlledSubstanceCategory): {
    publicVisible: boolean;
    requiresB2BVerification: boolean;
    requiresAgeGate: boolean;
    requiresLicense: boolean;
    canAdvertise: boolean;
  } {
    switch (category) {
      case 'ALCOHOL':
        return {
          publicVisible: false,
          requiresB2BVerification: true,
          requiresAgeGate: true,
          requiresLicense: false,
          canAdvertise: false,
        };

      case 'TOBACCO':
        return {
          publicVisible: false,
          requiresB2BVerification: true,
          requiresAgeGate: true,
          requiresLicense: false,
          canAdvertise: false,
        };

      case 'CANNABIS_THC':
        return {
          publicVisible: false,
          requiresB2BVerification: true,
          requiresAgeGate: true,
          requiresLicense: true,
          canAdvertise: false,
        };

      case 'NARCOTICS':
        return {
          publicVisible: false,
          requiresB2BVerification: true,
          requiresAgeGate: true,
          requiresLicense: true,
          canAdvertise: false,
        };

      case 'NONE':
      default:
        return {
          publicVisible: true,
          requiresB2BVerification: false,
          requiresAgeGate: false,
          requiresLicense: false,
          canAdvertise: true,
        };
    }
  }
}
