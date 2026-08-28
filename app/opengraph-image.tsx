import { ImageResponse } from "next/og";

export const alt = "Shipping Label Helper — size, scale, PDF and barcode checks";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px 78px",
          color: "#12324a",
          background: "linear-gradient(135deg, #f7fbff 0%, #e0f2fe 58%, #fef3c7 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: 720 }}>
          <div style={{ display: "flex", fontSize: 24, fontWeight: 700, letterSpacing: 2, color: "#0369a1" }}>
            BROWSER-LOCAL SHIPPING LABEL TOOLS
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 68, lineHeight: 1.05, fontWeight: 900 }}>
            Shipping Label Helper
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 31, lineHeight: 1.3, color: "#334155" }}>
            Size • Scale • PDF • Barcode • 4×6
          </div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 23, color: "#475569" }}>
            Check once. Print a safe test. Then use paid postage.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 300,
            height: 420,
            padding: 30,
            background: "white",
            border: "4px solid #0ea5e9",
            borderRadius: 28,
            boxShadow: "0 24px 60px rgba(18,50,74,.16)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 800 }}>
            <span>4 × 6</span><span>100%</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div style={{ display: "flex", width: 210, height: 13, background: "#12324a" }} />
            <div style={{ display: "flex", width: 170, height: 13, background: "#94a3b8" }} />
            <div style={{ display: "flex", width: 195, height: 13, background: "#94a3b8" }} />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 7, height: 125 }}>
            {[72, 108, 86, 120, 78, 114, 92, 124, 76, 106, 88, 118].map((height, index) => (
              <div key={index} style={{ display: "flex", width: index % 3 === 0 ? 10 : 6, height, background: "#0f172a" }} />
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
