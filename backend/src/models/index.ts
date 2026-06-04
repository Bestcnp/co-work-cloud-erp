/**
 * Consolidated Data Models
 *
 * Single source of truth for ALL TypeScript interfaces and types.
 * Organized by domain. Import everything from this barrel file.
 */

// ============================================================
// Tenant & Authentication
// ============================================================

export interface Tenant {
  tenantId: string;
  companyNameTH: string;
  companyNameEN: string;
  vatId: string;
  subscriptionTier: 'FREE' | 'PAID';
  verificationStatus: 'VERIFIED' | 'UNVERIFIED';
  isEmergencyFrozen: boolean;
  createdAt: string;
}

export interface TenantUser {
  userId: string;
  tenantId: string;
  assignedRole: string;
  permissions: string[];
  email: string;
  fullName: string;
  isKycVerified: boolean;
  isDeveloper: boolean;
  createdAt: string;
}

// ============================================================
// Tasks (Polymorphic Engine)
// ============================================================

export type TaskType =
  | 'STANDARD'
  | 'HR_CANDIDATE'
  | 'SALES_VISIT'
  | 'SPONSOR_REQUEST'
  | 'DESIGN_CONSULTATION';

export type TaskStatus =
  | 'NEW'
  | 'PROCESSING'
  | 'PENDING_APPROVAL'
  | 'COMPLETED'
  | 'CANCELLED';

export interface TaskBase {
  taskId: string;
  projectId: string;
  parentTaskId: string | null;
  taskType: TaskType;
  title: string;
  description: string;
  status: TaskStatus;
  assignees: string[];
  chatRoomId: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface HrCandidateMetadata {
  candidateName: string;
  positionApplied: string;
  gpa: number | null;
  satScore: number | null;
  ieltsScore: number | null;
}

export interface SalesVisitMetadata {
  targetCompany: string;
  targetGpsLat: number;
  targetGpsLng: number;
  visitVerified: boolean;
}

export interface SponsorRequestMetadata {
  sponsorCompany: string;
  budgetRequestTHB: number;
  budgetLines: BudgetLine[];
}

export interface BudgetLine {
  category: string;
  amountTHB: number;
  description: string;
}

export interface DesignConsultationMetadata {
  projectName: string;
  areaSqm: number;
  spaceCategory: SpaceCategory;
  aestheticStyle: AestheticStyle;
}

// ============================================================
// Chat
// ============================================================

export interface ChatMessage {
  messageId: string;
  chatRoomId: string;
  senderId: string;
  senderName: string;
  messageBody: string;
  replyToId: string | null;
  timestamp: string;
}

export interface ChatAttachment {
  attachmentId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  isEphemeral: boolean;
  expiresAt: string | null;
}

// ============================================================
// Products & Catalog
// ============================================================

export type ControlledSubstanceCategory =
  | 'NONE'
  | 'ALCOHOL'
  | 'TOBACCO'
  | 'CANNABIS_THC'
  | 'NARCOTICS';

export type ModerationStatus =
  | 'PENDING_HERMES_REVIEW'
  | 'ACTIVE'
  | 'REJECTED'
  | 'B2B_RESTRICTED'
  | 'BANNED_GLOBALLY'
  | 'QUARANTINED';

export interface MasterProduct {
  productId: string;
  brandOwnerTenantId: string;
  productName: string;
  brandName: string;
  sku: string;
  tisiCertificateNumber: string | null;
  isTisiCertificateActive: boolean;
  fdaNotificationNumber: string | null;
  suggestedRetailPriceTHB: number;
  minResellPriceTHB: number;
  maxResellPriceTHB: number;
  substanceCategory: ControlledSubstanceCategory;
  moderationStatus: ModerationStatus;
  createdAt: string;
}

// ============================================================
// Marketplace
// ============================================================

export interface MarketListing {
  listingId: string;
  tenantId: string;
  productName: string;
  categoryCode: string;
  substanceCategory: ControlledSubstanceCategory;
  baseReferencePriceTHB: number;
  moderationStatus: ModerationStatus;
  createdAt: string;
}

// ============================================================
// Showcase / Portfolio
// ============================================================

export type DesignerRole =
  | 'INTERIOR_DESIGNER'
  | 'ARCHITECT'
  | 'LANDSCAPE_DESIGNER';

export type SpaceCategory =
  | 'KITCHEN'
  | 'LIVING_ROOM'
  | 'BEDROOM'
  | 'BATHROOM'
  | 'OFFICE'
  | 'PENTHOUSE'
  | 'OUTDOOR';

export type AestheticStyle =
  | 'MINIMALIST'
  | 'SCANDINAVIAN'
  | 'JAPANDI'
  | 'LOFT'
  | 'MODERN'
  | 'CLASSIC';

export interface Hotspot {
  x: number;
  y: number;
  productId: string;
  label: string;
}

export interface DesignerShowcase {
  showcaseId: string;
  tenantId: string;
  designerUserId: string;
  designerRole: DesignerRole;
  title: string;
  description: string;
  imageUrl: string;
  spaceCategory: SpaceCategory;
  aestheticStyle: AestheticStyle;
  hotspots: Hotspot[];
  tags: string[];
  createdAt: string;
}

// ============================================================
// Recruitment Pipeline
// ============================================================

export type RecruitStatus =
  | 'NEW'
  | 'APPOINTED'
  | 'INTERVIEW'
  | 'RECRUITED'
  | 'NOT_PASS';

export interface AcademicMetrics {
  gpa: number | null;
  satScore: number | null;
  ieltsScore: number | null;
  institution: string;
}

export interface Recruit {
  recruitId: string;
  tenantId: string;
  fullName: string;
  email: string;
  phone: string;
  status: RecruitStatus;
  positionApplied: string;
  academicMetrics: AcademicMetrics;
  targetStartDate: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Compliance & Reporting
// ============================================================

export type AbuseReportStatus =
  | 'UNDER_REVIEW'
  | 'QUARANTINED'
  | 'RESOLVED_CLEAN'
  | 'HARD_BANNED';

export interface AbuseReport {
  reportId: string;
  targetType: 'PRODUCT' | 'SERVICE' | 'COMPANY';
  targetId: string;
  reporterId: string;
  reason: string;
  aiConfidenceScore: number;
  status: AbuseReportStatus;
  createdAt: string;
}

export type ComplianceCaseStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'INVESTIGATION';

export interface ComplianceCase {
  caseId: string;
  tenantId: string;
  caseType: string;
  description: string;
  status: ComplianceCaseStatus;
  resolvedBy: string | null;
  resolvedAt: string | null;
  createdAt: string;
}

// ============================================================
// Events
// ============================================================

export type AttendeeStatus =
  | 'REGISTERED'
  | 'CHECKED_IN'
  | 'NO_SHOW';

export interface EventAttendee {
  attendeeId: string;
  userId: string;
  fullName: string;
  status: AttendeeStatus;
  checkinTimestamp: string | null;
  gpsLat: number | null;
  gpsLng: number | null;
}

export interface Event {
  eventId: string;
  tenantId: string;
  title: string;
  description: string;
  venueName: string;
  venueGpsLat: number;
  venueGpsLng: number;
  checkInRadiusMeters: number;
  startDate: string;
  endDate: string;
  attendees: EventAttendee[];
  createdAt: string;
}

// ============================================================
// Billing
// ============================================================

export type SubscriptionTier = 'STARTER' | 'PRO' | 'ENTERPRISE';

export interface Subscription {
  subscriptionId: string;
  tenantId: string;
  tier: SubscriptionTier;
  monthlyPriceTHB: number;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
}

export interface Invoice {
  invoiceId: string;
  tenantId: string;
  amountTHB: number;
  description: string;
  status: 'DRAFT' | 'ISSUED' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  issuedAt: string;
  dueDate: string;
  paidAt: string | null;
}

// ============================================================
// ERP Ledger
// ============================================================

export interface LedgerEntry {
  accountCode: string;
  accountName: string;
  debitTHB: number;
  creditTHB: number;
}

export interface LedgerVoucher {
  voucherId: string;
  tenantId: string;
  description: string;
  entries: LedgerEntry[];
  totalDebitTHB: number;
  totalCreditTHB: number;
  createdBy: string;
  createdAt: string;
}

// ============================================================
// Hermes AI
// ============================================================

export interface HermesResponse {
  model: string;
  response: string;
  done: boolean;
  totalDuration?: number;
  promptEvalCount?: number;
  evalCount?: number;
}

export interface HermesConnectionStatus {
  connected: boolean;
  models: string[];
  error?: string;
}
