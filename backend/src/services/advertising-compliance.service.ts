/**
 * Advertising Compliance Service
 *
 * Enforces Thai advertising restrictions for controlled substances.
 * Restricted products (alcohol, tobacco, cannabis, narcotics) cannot
 * be promoted in ANY ad placement — not even inside B2B portals.
 *
 * Laws: Alcohol Control Act Sec 32, Tobacco Act, Cannabis Regulations 2025
 */

import type { ControlledSubstanceCategory } from '../models/index.js';

export type AdPlacementType =
  | 'CATEGORY_BANNER'
  | 'PRODUCT_HIGHLIGHT'
  | 'MAP_FEATURED_PIN'
  | 'SEARCH_PROMOTED'
  | 'HOMEPAGE_CAROUSEL'
  | 'B2B_INTERNAL_BANNER';

export interface AdEligibilityResult {
  eligible: boolean;
  reason: string;
  substanceCategory: ControlledSubstanceCategory;
  placementType: AdPlacementType;
}

/**
 * Banned marketing words for restricted substance descriptions.
 * Even in B2B, Section 32 prohibits "boasting" about alcohol.
 */
const BANNED_MARKETING_WORDS_EN = [
  'delicious', 'refreshing', 'crisp', 'smooth', 'premium quality',
  'best selling', 'award winning', 'perfect for', 'enjoy',
  'celebrate', 'party', 'special offer', 'buy now', 'limited edition',
  'exclusive', 'indulge', 'savor', 'taste the', 'crafted',
  'handcrafted', 'artisan', 'finest', 'exquisite',
];

const BANNED_MARKETING_WORDS_TH = [
  'อร่อย', 'สดชื่น', 'ชื่นใจ', 'นุ่มลื่น', 'คุณภาพเยี่ยม',
  'ขายดี', 'ยอดนิยม', 'เหมาะสำหรับ', 'ดื่มด่ำ', 'ฉลอง',
  'ปาร์ตี้', 'โปรโมชั่น', 'ซื้อเลย', 'รุ่นพิเศษ', 'สุดพิเศษ',
  'เอ็กซ์คลูซีฟ', 'ลิ้มรส', 'ดื่มได้', 'ดื่มกัน', 'หอม',
];

export class AdvertisingComplianceService {
  /**
   * Check if a product can be placed in an ad slot.
   * ANY substance !== NONE or CBD_BELOW_THRESHOLD → blocked from ALL placements.
   */
  static checkAdEligibility(
    substanceCategory: ControlledSubstanceCategory,
    placementType: AdPlacementType,
  ): AdEligibilityResult {
    // CBD below threshold can be advertised normally
    if (substanceCategory === 'NONE' || substanceCategory === 'CBD_BELOW_THRESHOLD') {
      return {
        eligible: true,
        reason: 'Product is eligible for advertising.',
        substanceCategory,
        placementType,
      };
    }

    // All other restricted substances — BLOCKED from ALL placements
    const lawReference = AdvertisingComplianceService.getLawReference(substanceCategory);

    return {
      eligible: false,
      reason: `Restricted product (${substanceCategory}) cannot be advertised. ${lawReference}`,
      substanceCategory,
      placementType,
    };
  }

  /**
   * Scan text for banned marketing language in restricted product descriptions.
   * Returns violations found.
   */
  static scanForMarketingLanguage(
    text: string,
    substanceCategory: ControlledSubstanceCategory,
  ): { hasViolation: boolean; violations: string[] } {
    // Only scan restricted categories
    if (substanceCategory === 'NONE' || substanceCategory === 'CBD_BELOW_THRESHOLD') {
      return { hasViolation: false, violations: [] };
    }

    const lowerText = text.toLowerCase();
    const violations: string[] = [];

    // Check English banned words
    for (const word of BANNED_MARKETING_WORDS_EN) {
      if (lowerText.includes(word.toLowerCase())) {
        violations.push(`Banned marketing term (EN): "${word}"`);
      }
    }

    // Check Thai banned words
    for (const word of BANNED_MARKETING_WORDS_TH) {
      if (text.includes(word)) {
        violations.push(`Banned marketing term (TH): "${word}"`);
      }
    }

    return {
      hasViolation: violations.length > 0,
      violations,
    };
  }

  /**
   * Scan public-facing text for restricted brand name leakage.
   * Used for SEO scrubbing and public profile validation.
   */
  static scanForBrandLeakage(
    publicText: string,
    restrictedBrands: string[],
  ): { hasLeakage: boolean; detectedBrands: string[] } {
    const lowerText = publicText.toLowerCase();
    const detected: string[] = [];

    for (const brand of restrictedBrands) {
      if (lowerText.includes(brand.toLowerCase())) {
        detected.push(brand);
      }
    }

    return {
      hasLeakage: detected.length > 0,
      detectedBrands: detected,
    };
  }

  /**
   * Get the Thai law reference for a substance category.
   */
  private static getLawReference(category: ControlledSubstanceCategory): string {
    switch (category) {
      case 'ALCOHOL':
        return 'Alcohol Control Act Sec 32 — advertising or boasting about alcohol is prohibited. Fine up to ฿500,000.';
      case 'TOBACCO':
        return 'Tobacco Products Control Act Art 31 — total ban on tobacco advertising in electronic media. Fine up to ฿500,000.';
      case 'CANNABIS_THC':
        return 'Cannabis Regulations 2025 — advertising cannabis to the public is illegal. Medical-only under MoPH license.';
      case 'NARCOTICS':
        return 'Narcotics Code — zero tolerance. Advertising narcotics is a criminal offense.';
      default:
        return '';
    }
  }
}
