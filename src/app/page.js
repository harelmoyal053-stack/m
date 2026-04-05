"use client";

import { useState } from "react";
import Link from "next/link";

const popularStocks = [
  { ticker: "AAPL", name: "Apple", price: "189.30", change: "+1.2%", positive: true, emoji: "🍎" },
  { ticker: "MSFT", name: "Microsoft", price: "415.20", change: "+0.8%", positive: true, emoji: "🪟" },
  { ticker: "NVDA", name: "Nvidia", price: "875.40", change: "-0.5%", positive: false, emoji: "🎮" },
  { ticker: "GOOGL", name: "Alphabet", price: "175.60", change: "+2.1%", positive: true, emoji: "🔍" },
  { ticker: "AMZN", name: "Amazon", price: "198.70", change: "+1.5%", positive: true, emoji: "📦" },
  { ticker: "TSLA", name: "Tesla", price: "248.50", change: "-2.3%", positive: false, emoji: "⚡" },
];

export default function Home() {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const ticker = query.trim().toUpperCase();
    if (ticker) {
      window.location.href = `/m/stock/${ticker}`;
    }
  };

  return (
    <main
      className="min-h-screen"
      style={{ background: "#FBFBFB", fontFamily: "'Heebo', sans-serif" }}
      dir="rtl"
    >
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "96px 24px 64px" }}>

        {/* Logo / Brand */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "#fff",
              borderRadius: 20,
              padding: "10px 22px",
              boxShadow: "0 8px 30px rgb(0,0,0,0.06)",
              marginBottom: 32,
            }}
          >
            <span style={{ fontSize: 20 }}>📈</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#1D1D1F", letterSpacing: "-0.3px" }}>
              StockIL
            </span>
          </div>

          <h1
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "#1D1D1F",
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
              margin: "0 0 16px",
            }}
          >
            מנתח המניות החכם
          </h1>
          <p style={{ fontSize: 19, color: "#86868B", fontWeight: 400, margin: 0 }}>
            הבן כל מניה בעברית פשוטה — בלי ז׳רגון, בלי בלבול
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ marginBottom: 64 }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="חפש מניה... (לדוגמה: AAPL, TSLA)"
              style={{
                width: "100%",
                padding: "20px 140px 20px 28px",
                fontSize: 17,
                color: "#1D1D1F",
                background: "#fff",
                borderRadius: 24,
                border: "none",
                boxShadow: "0 8px 30px rgb(0,0,0,0.07)",
                fontFamily: "'Heebo', sans-serif",
                transition: "box-shadow 0.3s ease-out",
                direction: "rtl",
              }}
              onFocus={(e) => (e.target.style.boxShadow = "0 8px 40px rgb(0,0,0,0.13)")}
              onBlur={(e) => (e.target.style.boxShadow = "0 8px 30px rgb(0,0,0,0.07)")}
            />
            <button
              type="submit"
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "#1D1D1F",
                color: "#fff",
                border: "none",
                borderRadius: 16,
                padding: "10px 22px",
                fontSize: 15,
                fontWeight: 600,
                fontFamily: "'Heebo', sans-serif",
                cursor: "pointer",
                transition: "background 0.3s ease-out",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#3D3D3F")}
              onMouseLeave={(e) => (e.target.style.background = "#1D1D1F")}
            >
              חיפוש
            </button>
          </div>
        </form>

        {/* Popular stocks label */}
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#86868B",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          מניות פופולריות
        </p>

        {/* Stock cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {popularStocks.map((stock) => (
            <StockCard key={stock.ticker} stock={stock} />
          ))}
        </div>

        {/* Footer note */}
        <p
          style={{
            textAlign: "center",
            fontSize: 13,
            color: "#86868B",
            marginTop: 64,
          }}
        >
          הנתונים הם לצורכי הדגמה בלבד ואינם ייעוץ פיננסי
        </p>
      </div>
    </main>
  );
}

function StockCard({ stock }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/stock/${stock.ticker}`}
      style={{
        display: "block",
        background: "#fff",
        borderRadius: 24,
        padding: "22px 20px",
        boxShadow: hovered
          ? "0 16px 48px rgb(0,0,0,0.10)"
          : "0 8px 30px rgb(0,0,0,0.04)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.3s ease-out",
        textDecoration: "none",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <span style={{ fontSize: 22 }}>{stock.emoji}</span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#86868B",
            background: "#F5F5F7",
            padding: "4px 8px",
            borderRadius: 8,
            letterSpacing: "0.05em",
          }}
        >
          {stock.ticker}
        </span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#1D1D1F", marginBottom: 4 }}>
        {stock.name}
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "#1D1D1F", marginBottom: 6 }}>
        ${stock.price}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: stock.positive ? "#34C759" : "#FF3B30",
        }}
      >
        {stock.change} היום
      </div>
    </Link>
  );
}
