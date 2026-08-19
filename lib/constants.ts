// ============================================================
// Shared constants for "أرباحي" — DO NOT change the numbers.
// These mirror the business rules exactly.
// Sensitive validation always happens server-side.
// ============================================================

export const WHEEL_SPIN_COST = 3500; // نقاط
export const WHEEL_SPIN_DURATION_MS = 13000; // 13 ثانية

export type WheelPrizeType =
  | "cash"
  | "points"
  | "voucher"
  | "again"
  | "nothing"
  | "physical";

export interface WheelSegment {
  id: string;
  label: string;
  type: WheelPrizeType;
  // amount: points for "points", EGP for "cash"
  amount?: number;
  probability: number; // percentage (sums to 100)
  color: string;
  needsInfo?: boolean; // requires shipping/contact info popup
}

// Default wheel — order matters (drawn clockwise). Admin can edit probabilities.
export const DEFAULT_WHEEL_SEGMENTS: WheelSegment[] = [
  { id: "cash300", label: "300 جنيه كاش", type: "cash", amount: 300, probability: 4.3333, color: "#16a085", needsInfo: true },
  { id: "cash490", label: "490 جنيه كاش", type: "cash", amount: 490, probability: 4.3333, color: "#1abc9c", needsInfo: true },
  { id: "luck", label: "حظ أوفر", type: "nothing", probability: 50, color: "#34495e" },
  { id: "again", label: "جرب مرة أخرى", type: "again", probability: 11, color: "#2c3e50" },
  { id: "cash510", label: "510 جنيه كاش", type: "cash", amount: 510, probability: 4.3334, color: "#0e8f78", needsInfo: true },
  { id: "voucher", label: "قسيمة", type: "voucher", probability: 8.6667, color: "#f1c40f" },
  { id: "points40", label: "40 نقطة", type: "points", amount: 40, probability: 8.6667, color: "#e67e22" },
  { id: "points60", label: "60 نقطة", type: "points", amount: 60, probability: 8.6666, color: "#e74c3c" },
  { id: "smartwatch", label: "ساعة سمارت", type: "physical", probability: 0, color: "#8e44ad", needsInfo: true },
  { id: "airpods", label: "AirPods الجيل الخامس", type: "physical", probability: 0, color: "#2980b9", needsInfo: true },
];

// ---- Tasks ----
export const TASKS = {
  referrals: { id: "referrals", title: "إدخال 10 أشخاص من رابط الإحالة", target: 10, reward: 11 },
  browsing: { id: "browsing", title: "تصفح الموقع لمدة 15 دقيقة", target: 15, reward: 6 }, // minutes
  shareArticles: { id: "shareArticles", title: "مشاركة 3 مقالات", target: 3, reward: 6 },
  interactions: { id: "interactions", title: "الحصول على 10 تفاعلات على مقال واحد", target: 10, reward: 5 },
} as const;

// ---- Browsing points ----
export const BROWSING_POINT_PER_MINUTE = 1;
export const BROWSING_DAILY_CAP = 20; // نقاط

// ---- Articles ----
export const ARTICLE_PUBLISH_REWARD = 3;
export const ARTICLE_DAILY_LIMIT = 1;

// ---- Store ----
export const POINTS_PER_EGP_UNIT = 100; // كل 100 نقطة = 5 جنيه
export const EGP_PER_UNIT = 5;
export const STORE_MIN_POINTS = 100;

export interface StoreProduct {
  id: string;
  title: string;
  cost: number; // points
  kind: "balance" | "voucher";
  value?: number; // EGP for balance
}

export const STORE_PRODUCTS: StoreProduct[] = [
  { id: "balance5", title: "5 جنيه رصيد", cost: 100, kind: "balance", value: 5 },
  { id: "balance12", title: "12 جنيه رصيد", cost: 300, kind: "balance", value: 12 },
  { id: "voucher1", title: "قسيمة واحدة للدخول في السحب", cost: 300, kind: "voucher" },
];

// ---- Draws ----
export const DRAW_DURATION_DAYS = 30; // شهر كامل

// ---- Admin email for winner notifications ----
export const ADMIN_EMAIL = "abdulshafiosama82@gmail.com";
export const DEVELOPER_NAME = "أسامة الحجر";

// ---- Sections ----
export const SECTIONS = [
  { key: "home", label: "الرئيسية", href: "/", icon: "home" },
  { key: "tasks", label: "المهام", href: "/tasks", icon: "tasks" },
  { key: "wheel", label: "عجلة الحظ", href: "/wheel", icon: "wheel" },
  { key: "articles", label: "المقالات", href: "/articles", icon: "articles" },
  { key: "store", label: "المتجر", href: "/store", icon: "store" },
  { key: "draws", label: "السحوبات", href: "/draws", icon: "draws" },
  { key: "groups", label: "الشات", href: "/groups", icon: "chat" },
  { key: "account", label: "حسابي", href: "/account", icon: "account" },
] as const;

// Moderator permission keys
export const MODERATOR_PERMS = [
  { key: "articles", label: "إدارة المقالات" },
  { key: "reports", label: "مراجعة البلاغات" },
  { key: "draws", label: "إدارة السحوبات" },
  { key: "users", label: "مراجعة المستخدمين" },
  { key: "chat", label: "إدارة الشات والجروبات" },
] as const;
