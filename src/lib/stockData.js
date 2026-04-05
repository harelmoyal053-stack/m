export const stocks = {
  AAPL: {
    name: "Apple Inc.",
    ticker: "AAPL",
    price: "189.30",
    change: "+2.26",
    changePct: "+1.21%",
    positive: true,
    description:
      "חברת הטכנולוגיה הגדולה בעולם, מפתחת ומוכרת אייפונים, מחשבי מק, שעוני אפל, ושירותים דיגיטליים כמו App Store ו-Apple Music.",
    aiSummary: {
      growth:
        "הכנסות החברה גדלות בקצב יציב של כ-8% בשנה — לא פרועות, אך אמינות כמו שעון שוויצרי.",
      profit:
        "מתוך כל 100 דולר שהחברה גובה, היא שומרת לעצמה כ-25 דולר — זה אחד משיעורי הרווח הגבוהים בתעשייה.",
      risk: "כ-52% מהכנסות החברה מגיעות מהאייפון — אם שוק הסמארטפונים יואט, החברה תרגיש את זה.",
    },
    financials: [
      { label: "הכנסות שנתיות", value: 383, max: 500, formatted: "383 מיליארד $", color: "#5AC8FA" },
      { label: "רווח גולמי", value: 170, max: 500, formatted: "170 מיליארד $", color: "#34C759" },
      { label: "רווח נקי", value: 97, max: 500, formatted: "97 מיליארד $", color: "#30D158" },
    ],
    revenueBreakdown: [
      { label: "📱 אייפון", value: 52, description: "מחצית ההכנסות מגיעות ממכירת אייפונים" },
      { label: "☁️ שירותים", value: 22, description: "App Store, Apple Music, iCloud ועוד" },
      { label: "💻 מק", value: 10, description: "מחשבים ניידים ושולחניים" },
      { label: "📱 אייפד", value: 9, description: "טאבלטים לכל הגילאים" },
      { label: "⌚ ווירבלס", value: 7, description: "Apple Watch, AirPods ואביזרים" },
    ],
  },
  MSFT: {
    name: "Microsoft Corp.",
    ticker: "MSFT",
    price: "415.20",
    change: "+3.32",
    changePct: "+0.81%",
    positive: true,
    description:
      "ענקית הטכנולוגיה שמאחורי Windows, Office ו-Azure — פלטפורמת הענן שגדלה הכי מהר בעולם.",
    aiSummary: {
      growth:
        "הענן (Azure) גדל בקצב של 28% בשנה — זה המנוע הראשי שמאיץ את כל החברה קדימה.",
      profit:
        "מתוך כל 100 דולר הכנסה, החברה שומרת 35 דולר רווח נקי — מדהים לחברה בגודלה.",
      risk: "תחרות עזה עם AWS של אמזון ו-Google Cloud — שלושתם נלחמים על אותם לקוחות.",
    },
    financials: [
      { label: "הכנסות שנתיות", value: 212, max: 500, formatted: "212 מיליארד $", color: "#5AC8FA" },
      { label: "רווח גולמי", value: 146, max: 500, formatted: "146 מיליארד $", color: "#34C759" },
      { label: "רווח נקי", value: 72, max: 500, formatted: "72 מיליארד $", color: "#30D158" },
    ],
    revenueBreakdown: [
      { label: "☁️ Azure ענן", value: 43, description: "שירותי ענן לעסקים — הצמיחה הכי מהירה" },
      { label: "💼 Office 365", value: 32, description: "מנויים חודשיים לחבילת המשרד" },
      { label: "🎮 Xbox ומשחקים", value: 13, description: "קונסולות, משחקים, ו-Game Pass" },
      { label: "🖥️ Windows", value: 8, description: "מערכת ההפעלה לכל המחשבים" },
      { label: "🔗 אחר", value: 4, description: "LinkedIn, Bing ועוד" },
    ],
  },
  NVDA: {
    name: "Nvidia Corp.",
    ticker: "NVDA",
    price: "875.40",
    change: "-4.38",
    changePct: "-0.50%",
    positive: false,
    description:
      "החברה שמייצרת את השבבים החזקים ביותר בעולם — כל מערכת AI גדולה רצה על השבבים שלה.",
    aiSummary: {
      growth:
        "ההכנסות קפצו 122% בשנה אחת — זה לא צמיחה רגילה, זה אירוע חד פעמי בהיסטוריה של תעשיית השבבים.",
      profit:
        "שיעור הרווח הגולמי עמד על 74% — כלומר מכל 100 דולר מכירה, 74 דולר הם רווח טהור לפני הוצאות.",
      risk: "כמעט 90% מהכנסות ה-AI מגיעות מ-4 לקוחות בלבד — אם אחד מהם יעזוב, זה ייכאב.",
    },
    financials: [
      { label: "הכנסות שנתיות", value: 440, max: 500, formatted: "60 מיליארד $", color: "#5AC8FA" },
      { label: "רווח גולמי", value: 350, max: 500, formatted: "44 מיליארד $", color: "#34C759" },
      { label: "רווח נקי", value: 280, max: 500, formatted: "29 מיליארד $", color: "#30D158" },
    ],
    revenueBreakdown: [
      { label: "🤖 מרכזי נתונים / AI", value: 87, description: "שבבים לאימון מודלי AI — הביזנס שפצץ" },
      { label: "🎮 גיימינג", value: 9, description: "כרטיסי מסך לגיימרים" },
      { label: "🔬 מקצועי", value: 3, description: "גרפיקה לעיצוב ומהנדסים" },
      { label: "🚗 רכב אוטונומי", value: 1, description: "שבבים לרכבים חכמים — עוד קטן אבל גדל מהר" },
    ],
  },
  GOOGL: {
    name: "Alphabet Inc.",
    ticker: "GOOGL",
    price: "175.60",
    change: "+3.62",
    changePct: "+2.10%",
    positive: true,
    description:
      "החברה האם של Google — מחזיקה את מנוע החיפוש הגדול בעולם, YouTube, ופלטפורמת הענן Google Cloud.",
    aiSummary: {
      growth:
        "פרסום בגוגל ממשיך לצמוח ב-11% בשנה — כל עסק בעולם עדיין צריך להופיע בגוגל.",
      profit:
        "מתוך כל 100 דולר הכנסה, החברה שומרת 24 דולר נקיים — יציב וחזק כמו תמיד.",
      risk: "AI חדש כמו ChatGPT מאיים על הדומיננטיות של חיפוש גוגל — זו האתגר הגדול ביותר בהיסטוריית החברה.",
    },
    financials: [
      { label: "הכנסות שנתיות", value: 307, max: 500, formatted: "307 מיליארד $", color: "#5AC8FA" },
      { label: "רווח גולמי", value: 175, max: 500, formatted: "175 מיליארד $", color: "#34C759" },
      { label: "רווח נקי", value: 74, max: 500, formatted: "74 מיליארד $", color: "#30D158" },
    ],
    revenueBreakdown: [
      { label: "🔍 חיפוש גוגל", value: 57, description: "פרסומות שמופיעות כשאתם מחפשים" },
      { label: "▶️ YouTube", value: 11, description: "פרסומות לפני ובמהלך סרטונים" },
      { label: "☁️ Google Cloud", value: 11, description: "שירותי ענן לעסקים וסטארטאפים" },
      { label: "📱 Google Network", value: 10, description: "פרסומות באתרים אחרים דרך גוגל" },
      { label: "🎯 אחר", value: 11, description: "Google Play, Pixel, Waymo ועוד" },
    ],
  },
  AMZN: {
    name: "Amazon.com Inc.",
    ticker: "AMZN",
    price: "198.70",
    change: "+2.93",
    changePct: "+1.50%",
    positive: true,
    description:
      "הרבה יותר מחנות אונליין — AWS הוא פלטפורמת הענן מספר 1 בעולם, ומפרנסת את רוב הרווח של החברה.",
    aiSummary: {
      growth:
        "הכנסות גדלות ב-12% בשנה, אך AWS גדל ב-17% — הענן הוא הלב הפועם של העסק.",
      profit:
        "הקמעונאות בקושי מרוויחה, אבל AWS מייצר שיעורי רווח של 38% — כסף אמיתי.",
      risk: "עלויות הפיזיות (מחסנים, משלוחים) עצומות ורגישות לאינפלציה — כל עלייה בשכר מינימום נכאבת.",
    },
    financials: [
      { label: "הכנסות שנתיות", value: 500, max: 500, formatted: "575 מיליארד $", color: "#5AC8FA" },
      { label: "רווח גולמי", value: 245, max: 500, formatted: "245 מיליארד $", color: "#34C759" },
      { label: "רווח נקי", value: 60, max: 500, formatted: "30 מיליארד $", color: "#30D158" },
    ],
    revenueBreakdown: [
      { label: "🛒 חנות Online", value: 38, description: "מכירות ישירות של מוצרים באמזון" },
      { label: "☁️ AWS ענן", value: 17, description: "הענן שמריץ את האינטרנט — רווחי ביותר" },
      { label: "🏪 מוכרים חיצוניים", value: 24, description: "עמלות ממוכרים שמשתמשים בפלטפורמה" },
      { label: "📺 פרסום ו-Prime", value: 14, description: "Prime Video, Alexa ופרסומות" },
      { label: "🏬 חנויות פיזיות", value: 7, description: "Whole Foods ורשת החנויות" },
    ],
  },
  TSLA: {
    name: "Tesla Inc.",
    ticker: "TSLA",
    price: "248.50",
    change: "-5.82",
    changePct: "-2.29%",
    positive: false,
    description:
      "יצרנית רכב חשמלי שהפכה את עולם הרכב, ומפתחת גם בטריות, פאנלים סולאריים, ותוכנת נהיגה עצמאית.",
    aiSummary: {
      growth:
        "מכירות הרכבים גדלו רק 2% השנה — האטה משמעותית לאחר שנים של צמיחה דרמטית.",
      profit:
        "שיעור הרווח הגולמי ירד ל-18% בגלל קיצוצי מחירים אגרסיביים — תחרות מסין לוחצת.",
      risk: "תלות חזקה בסנטימנט שוק ובאילון מאסק אישית — כל ציוץ שלו יכול להזיז את המניה 10%.",
    },
    financials: [
      { label: "הכנסות שנתיות", value: 185, max: 500, formatted: "97 מיליארד $", color: "#5AC8FA" },
      { label: "רווח גולמי", value: 80, max: 500, formatted: "18 מיליארד $", color: "#34C759" },
      { label: "רווח נקי", value: 45, max: 500, formatted: "7 מיליארד $", color: "#30D158" },
    ],
    revenueBreakdown: [
      { label: "🚗 מכירת רכבים", value: 82, description: "Model 3, Y, S, X, Cybertruck" },
      { label: "🔋 אנרגיה", value: 8, description: "Powerwall, פאנלים סולאריים" },
      { label: "🛠️ שירות ורכיבים", value: 6, description: "תחזוקה ותיקון רכבים" },
      { label: "💻 FSD ורישיונות", value: 4, description: "תוכנת נהיגה עצמאית — הסיפור הגדול לעתיד" },
    ],
  },
};

export const allTickers = Object.keys(stocks);

export function getStock(ticker) {
  return stocks[ticker.toUpperCase()] || null;
}
