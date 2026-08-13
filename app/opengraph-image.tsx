import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { BUSINESS } from "@/lib/data";

/* The card that renders whenever someone shares the site — in a text, a
   Facebook group, a DM. Without it those links render as a blank grey box,
   which for a business that gets found by word of mouth is a real cost.

   Built over the shop's own hero photo rather than a flat colour, so the
   preview shows a car. */
export const alt = "Dallas Tint Shop — premium tint, PPF and wraps in Richardson, TX";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const photo = await readFile(
    join(process.cwd(), "public/gallery/ppf/2025-03-06_car_ppf_DG3e4auuq0Z_1.jpg"),
  );
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", inset: 0, objectFit: "cover" }}
        />
        {/* Two things Satori will not do: `inset: 0` on an empty div, and
            gradients via the `background` shorthand. Explicit box plus
            `backgroundImage` works — the first version of this card put the
            headline over a bright photo with no scrim at all. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage:
              "linear-gradient(90deg, rgba(5,5,5,0.93) 0%, rgba(5,5,5,0.88) 42%, rgba(5,5,5,0.30) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 72px",
            width: 760,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#C1121F",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 6,
              fontFamily: "sans-serif",
            }}
          >
            RICHARDSON · DALLAS, TX
          </div>
          <div
            style={{
              marginTop: 18,
              color: "#fff",
              fontSize: 78,
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: -2,
              fontFamily: "sans-serif",
            }}
          >
            Premium tint, PPF
          </div>
          <div
            style={{
              color: "#C1121F",
              fontSize: 78,
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: -2,
              fontStyle: "italic",
              fontFamily: "sans-serif",
            }}
          >
            &amp; wraps.
          </div>
          <div
            style={{
              marginTop: 26,
              display: "flex",
              color: "rgba(255,255,255,0.72)",
              fontSize: 27,
              fontFamily: "sans-serif",
            }}
          >
            {`${BUSINESS.rating.toFixed(1)}/5 from ${BUSINESS.reviewCount} Google reviews  ·  ${BUSINESS.phone}`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
