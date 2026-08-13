import { ImageResponse } from "next/og";

/* Favicon, generated at build time rather than shipped as a binary — the
   shop has no logo file yet, so this is the "DTS" mark from the navbar.
   Swap for a real app/icon.png the moment they hand one over. */
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          border: "3px solid #C1121F",
          borderRadius: 12,
          color: "#fff",
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: -1,
          fontFamily: "sans-serif",
        }}
      >
        DTS
      </div>
    ),
    size,
  );
}
