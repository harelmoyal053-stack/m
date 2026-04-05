export type Category = "drinks" | "dairy" | "pantry" | "produce" | "household";

export interface Product {
  id: number;
  name: string;
  qty: string;
  cat: Category;
  img: string;
  prices: Record<Supermarket, number>;
  alternative?: string; // cheaper alternative suggestion
}

export type Supermarket = "shufersal" | "rami" | "yohananof";

export interface SupermarketMeta {
  id: Supermarket;
  name: string;
  tagline: string;
  color: string;
  bgLight: string;
  arrival: string;
}

export const SUPERMARKETS: SupermarketMeta[] = [
  { id: "shufersal", name: "שופרסל", tagline: "פשוט בשבילך", color: "#0057b8", bgLight: "#e8f0fb", arrival: "5 דק׳" },
  { id: "rami",      name: "רמי לוי", tagline: "המחיר הנמוך ביותר", color: "#e31837", bgLight: "#fde8eb", arrival: "12 דק׳" },
  { id: "yohananof", name: "יוחננוף",  tagline: "כי המשפחה חשובה", color: "#2d8653", bgLight: "#e6f4ec", arrival: "8 דק׳" },
];

export const PRODUCTS: Product[] = [
  { id: 1,  name: "קוקה קולה",    qty: "1.5 ליטר",       cat: "drinks",    img: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop", prices: { shufersal: 7.90,  rami: 6.90,  yohananof: 7.50  } },
  { id: 2,  name: "מים מינרליים", qty: "שישייה 1.5 ל׳",  cat: "drinks",    img: "https://images.unsplash.com/photo-1559839914-17aae19cec71?w=400&h=300&fit=crop", prices: { shufersal: 15.90, rami: 13.90, yohananof: 14.90 } },
  { id: 3,  name: "קפה נמס",      qty: "200 גרם",         cat: "drinks",    img: "https://images.unsplash.com/photo-1509042239860-f55ce641d7a3?w=400&h=300&fit=crop", prices: { shufersal: 29.90, rami: 26.90, yohananof: 28.50 }, alternative: "קפה מותג פרטי 200 גרם — ₪18.90" },
  { id: 4,  name: "חלב 3%",       qty: "1 ליטר",          cat: "dairy",     img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop", prices: { shufersal: 6.90,  rami: 5.90,  yohananof: 6.50  } },
  { id: 5,  name: "קוטג׳ 5%",     qty: "גביע 250 גרם",    cat: "dairy",     img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop", prices: { shufersal: 5.90,  rami: 4.90,  yohananof: 5.50  } },
  { id: 6,  name: "גבינה צהובה",  qty: "200 גרם",         cat: "dairy",     img: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a432?w=400&h=300&fit=crop", prices: { shufersal: 14.90, rami: 12.90, yohananof: 13.90 }, alternative: "גבינה מותג פרטי 200 גרם — ₪9.90" },
  { id: 7,  name: "פסטה",         qty: "500 גרם",         cat: "pantry",    img: "https://images.unsplash.com/photo-1551462934-3d9dc46a7b73?w=400&h=300&fit=crop", prices: { shufersal: 5.90,  rami: 4.50,  yohananof: 5.20  } },
  { id: 8,  name: "אורז",         qty: '1 ק"ג',           cat: "pantry",    img: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&h=300&fit=crop", prices: { shufersal: 8.90,  rami: 7.50,  yohananof: 8.20  } },
  { id: 9,  name: "שמן זית",      qty: '750 מ"ל',         cat: "pantry",    img: "https://images.unsplash.com/photo-1474979078-b5b9a49c9eea?w=400&h=300&fit=crop", prices: { shufersal: 32.90, rami: 28.90, yohananof: 30.90 }, alternative: "שמן קנולה 750מ\"ל — ₪12.90" },
  { id: 10, name: "טונה",         qty: "רביעייה 160 גרם", cat: "pantry",    img: "https://images.unsplash.com/photo-1608138278456-c7a8fcae4e66?w=400&h=300&fit=crop", prices: { shufersal: 18.90, rami: 15.90, yohananof: 17.50 } },
  { id: 11, name: "במבה",         qty: "חבילה גדולה",     cat: "pantry",    img: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=300&fit=crop", prices: { shufersal: 12.90, rami: 11.50, yohananof: 12.50 } },
  { id: 12, name: "עגבניות",      qty: '1 ק"ג',           cat: "produce",   img: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop", prices: { shufersal: 8.90,  rami: 7.90,  yohananof: 8.50  } },
  { id: 13, name: "מלפפונים",     qty: '1 ק"ג',           cat: "produce",   img: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&h=300&fit=crop", prices: { shufersal: 5.90,  rami: 4.90,  yohananof: 5.50  } },
  { id: 14, name: "תפוחי אדמה",   qty: '1 ק"ג',           cat: "produce",   img: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop", prices: { shufersal: 4.90,  rami: 3.90,  yohananof: 4.50  } },
  { id: 15, name: "נייר טואלט",   qty: "30 גלילים",       cat: "household", img: "https://images.unsplash.com/photo-1584462167821-8bdf9e0d8f3a?w=400&h=300&fit=crop", prices: { shufersal: 59.90, rami: 52.90, yohananof: 56.90 } },
  { id: 16, name: "נוזל כלים",    qty: '750 מ"ל',         cat: "household", img: "https://images.unsplash.com/photo-1585241936939-be4099591252?w=400&h=300&fit=crop", prices: { shufersal: 9.90,  rami: 8.50,  yohananof: 9.20  } },
  { id: 17, name: "שמפו",         qty: '400 מ"ל',         cat: "household", img: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=300&fit=crop", prices: { shufersal: 18.90, rami: 16.90, yohananof: 17.90 } },
];

export const QUICK_LISTS = [
  { label: "🧺 סל בסיסי",   ids: [1, 4, 7, 8, 12, 13] },
  { label: "🔥 על האש",      ids: [1, 2, 12, 13, 14, 10] },
  { label: "🧹 סל ניקיונות", ids: [15, 16, 17] },
];

export const HOT_DEALS = [
  { productId: 2,  store: "rami"      as Supermarket, salePrice: 11.90, badge: "🔥 מבצע שבועי" },
  { productId: 6,  store: "yohananof" as Supermarket, salePrice: 10.90, badge: "⚡ מבצע בלעדי" },
  { productId: 9,  store: "shufersal" as Supermarket, salePrice: 27.90, badge: "💚 מחיר מיוחד" },
  { productId: 15, store: "rami"      as Supermarket, salePrice: 44.90, badge: "🏷️ חיסול מלאי" },
  { productId: 11, store: "shufersal" as Supermarket, salePrice: 10.90, badge: "🎉 מבצע עונתי" },
  { productId: 3,  store: "yohananof" as Supermarket, salePrice: 24.90, badge: "⭐ המחיר השבוע" },
];
