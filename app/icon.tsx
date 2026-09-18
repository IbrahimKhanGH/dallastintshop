import { ImageResponse } from "next/og";

/* Favicon, generated at build time. The shop's logo is a wide wordmark
   (about 4.3:1) that turns to mush at 16–32px, and cropping or redrawing it
   into a square would alter the artwork — so the favicon stays a neutral
   "DTS" tile until the shop supplies a square mark. */
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
