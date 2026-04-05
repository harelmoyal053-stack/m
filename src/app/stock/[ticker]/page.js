import Link from "next/link";
import { getStock, allTickers } from "@/lib/stockData";

export function generateStaticParams() {
  return allTickers.map((ticker) => ({ ticker }));
}

export default async function StockPage({ params }) {
  const { ticker } = await params;
  const stock = getStock(ticker);

  if (!stock) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#FBFBFB",
          fontFamily: "'Heebo', sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        dir="rtl"
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🔍</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1D1D1F", marginBottom: 12 }}>
            המניה לא נמצאה
          </h1>
          <p style={{ color: "#86868B", marginBottom: 32 }}>
            לא מצאנו נתונים עבור הטיקר &quot;{ticker}&quot;
          </p>
          <Link
            href="/"
            style={{
              background: "#1D1D1F",
              color: "#fff",
              padding: "12px 28px",
              borderRadius: 16,
              textDecoration: "none",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            חזרה לדף הבית
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#FBFBFB",
        fontFamily: "'Heebo', sans-serif",
      }}
      dir="rtl"
    >
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Back button */}
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "#86868B",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 40,
            transition: "color 0.2s ease-out",
          }}
        >
          ← חזרה לדף הבית
        </Link>

        {/* ── Card 1: Overview ── */}
        <Card style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#86868B",
                    background: "#F5F5F7",
                    padding: "4px 10px",
                    borderRadius: 8,
                    letterSpacing: "0.06em",
                  }}
                >
                  {stock.ticker}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: stock.positive ? "#34C759" : "#FF3B30",
                    background: stock.positive ? "#F0FFF4" : "#FFF5F5",
                    padding: "4px 10px",
                    borderRadius: 8,
                  }}
                >
                  {stock.changePct} היום
                </span>
              </div>
              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#1D1D1F",
                  margin: "0 0 4px",
                  letterSpacing: "-0.5px",
                }}
              >
                {stock.name}
              </h1>
            </div>
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 800,
                  color: "#1D1D1F",
                  letterSpacing: "-1px",
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                ${stock.price}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: stock.positive ? "#34C759" : "#FF3B30",
                  fontWeight: 600,
                  textAlign: "left",
                }}
              >
                {stock.positive ? "+" : ""}{stock.change}$
              </div>
            </div>
          </div>

          <Divider />

          <p style={{ fontSize: 15, color: "#3D3D3F", lineHeight: 1.7, margin: "20px 0 0" }}>
            {stock.description}
          </p>
        </Card>

        {/* ── Card 2: AI Summary ── */}
        <Card style={{ marginBottom: 20 }}>
          <SectionTitle>🤖 השורה התחתונה</SectionTitle>
          <p style={{ fontSize: 13, color: "#86868B", margin: "-8px 0 20px" }}>
            ניתוח חכם של הנתונים — בשפה פשוטה
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <AiBullet
              icon="📈"
              label="צמיחה"
              labelColor="#34C759"
              text={stock.aiSummary.growth}
            />
            <AiBullet
              icon="💰"
              label="רווחיות"
              labelColor="#5AC8FA"
              text={stock.aiSummary.profit}
            />
            <AiBullet
              icon="⚠️"
              label="סיכון"
              labelColor="#FF9500"
              text={stock.aiSummary.risk}
            />
          </div>
        </Card>

        {/* ── Card 3: Financials ── */}
        <Card style={{ marginBottom: 20 }}>
          <SectionTitle>📊 נתונים פיננסיים</SectionTitle>
          <p style={{ fontSize: 13, color: "#86868B", margin: "-8px 0 24px" }}>
            מה המספרים אומרים בפועל — השנה האחרונה
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {stock.financials.map((item) => (
              <FinancialBar key={item.label} item={item} />
            ))}
          </div>
        </Card>

        {/* ── Card 4: Revenue Breakdown ── */}
        <Card>
          <SectionTitle>💰 מאיפה מגיע הכסף?</SectionTitle>
          <p style={{ fontSize: 13, color: "#86868B", margin: "-8px 0 24px" }}>
            פירוט מקורות ההכנסה של החברה
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {stock.revenueBreakdown.map((item, i) => (
              <RevenueBar key={i} item={item} index={i} />
            ))}
          </div>
        </Card>

        {/* Disclaimer */}
        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#86868B",
            marginTop: 48,
            lineHeight: 1.6,
          }}
        >
          הנתונים המוצגים הם לצורכי הדגמה בלבד ואינם מהווים ייעוץ פיננסי או המלצת השקעה.
        </p>
      </div>
    </main>
  );
}

/* ── Sub-components ── */

function Card({ children, style }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 28,
        padding: "28px 28px",
        boxShadow: "0 8px 30px rgb(0,0,0,0.04)",
        transition: "all 0.3s ease-out",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2
      style={{
        fontSize: 18,
        fontWeight: 700,
        color: "#1D1D1F",
        margin: "0 0 8px",
        letterSpacing: "-0.3px",
      }}
    >
      {children}
    </h2>
  );
}

function Divider() {
  return (
    <div
      style={{
        height: 1,
        background: "#F5F5F7",
        margin: "0",
      }}
    />
  );
}

function AiBullet({ icon, label, labelColor, text }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
        padding: "16px 18px",
        background: "#FAFAFA",
        borderRadius: 18,
        transition: "all 0.3s ease-out",
      }}
    >
      <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <div>
        <span
          style={{
            display: "inline-block",
            fontSize: 12,
            fontWeight: 700,
            color: labelColor,
            marginBottom: 5,
            letterSpacing: "0.03em",
          }}
        >
          {label}
        </span>
        <p style={{ fontSize: 14, color: "#3D3D3F", lineHeight: 1.65, margin: 0 }}>
          {text}
        </p>
      </div>
    </div>
  );
}

function FinancialBar({ item }) {
  const pct = Math.min((item.value / item.max) * 100, 100);
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: "#1D1D1F" }}>{item.label}</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#1D1D1F" }}>{item.formatted}</span>
      </div>
      <div
        style={{
          height: 8,
          background: "#F5F5F7",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: item.color,
            borderRadius: 99,
            transition: "width 0.6s ease-out",
          }}
        />
      </div>
    </div>
  );
}

const BAR_COLORS = [
  "#5AC8FA",
  "#34C759",
  "#AF52DE",
  "#FF9500",
  "#FF3B30",
  "#007AFF",
];

function RevenueBar({ item, index }) {
  const color = BAR_COLORS[index % BAR_COLORS.length];
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <div>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1D1D1F" }}>{item.label}</span>
          <p style={{ fontSize: 12, color: "#86868B", margin: "2px 0 0" }}>{item.description}</p>
        </div>
        <span
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#1D1D1F",
            flexShrink: 0,
            marginRight: 16,
          }}
        >
          {item.value}%
        </span>
      </div>
      <div
        style={{
          height: 6,
          background: "#F5F5F7",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${item.value}%`,
            background: color,
            borderRadius: 99,
            transition: "width 0.6s ease-out",
            opacity: 0.85,
          }}
        />
      </div>
    </div>
  );
}
