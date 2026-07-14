import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#060606",
          color: "#f2f0ea",
          padding: 64,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 6,
            opacity: 0.6,
          }}
        >
          <span>SİSTEM GÜNLÜĞÜ</span>
          <span>KOCAELİ, TR</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 110, fontWeight: 800, letterSpacing: -2 }}>MUSTAFA ULUTAŞ</div>
          <div style={{ fontSize: 34, letterSpacing: 10, marginTop: 16, opacity: 0.85 }}>
            FULL-STACK SOFTWARE DEVELOPER
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 4,
            opacity: 0.6,
            borderTop: "1px solid rgba(242,240,234,0.25)",
            paddingTop: 24,
          }}
        >
          <span>.NET · CLEAN ARCHITECTURE · CQRS · REACT + TS</span>
          <span>mustafaulutas.com</span>
        </div>
      </div>
    ),
    size,
  );
}
