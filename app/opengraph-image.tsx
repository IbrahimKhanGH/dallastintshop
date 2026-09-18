import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { BUSINESS, CERTIFICATION } from "@/lib/business";

/* The card that renders whenever someone shares the site — in a text, a
   Facebook group, a DM. Without it those links render as a blank grey box,
   which for a business that gets found by word of mouth is a real cost.

   Built over the shop's own hero photo rather than a flat colour, so the
   preview shows a car, with the shop's real logo artwork on top. No rating
   or review count: this image is cached by every platform it's shared to,
   so any number baked in here would go stale. */
export const alt = "Dallas Tint Shop — window tint, PPF, wraps and chrome delete in Richardson, TX";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const photo = await readFile(
    join(process.cwd(), "public/gallery/ppf/2025-03-06_car_ppf_DG3e4auuq0Z_1.jpg"),
  );
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;
  // src is a web path ("/brand/…"); path.join would treat a leading slash
  // as an absolute path and drop `public/`.
  const logo = await readFile(join(process.cwd(), "public", BUSINESS.logo.darkSrc.replace(/^\//, "")));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const logoH = 140;
  const logoW = Math.round((BUSINESS.logo.width / BUSINESS.logo.height) * logoH);

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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt=""
            width={logoW}
            height={logoH}
            // Dark-background version of the artwork (components/Logo.tsx);
            // the negative margin absorbs its built-in side margin.
            style={{ marginLeft: -Math.round(logoW * 0.11), marginBottom: 12 }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#ff3b47",
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
              fontSize: 64,
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: -2,
              fontFamily: "sans-serif",
            }}
          >
            Tint, PPF, wraps
          </div>
          <div
            style={{
              color: "#C1121F",
              fontSize: 64,
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: -2,
              fontStyle: "italic",
              fontFamily: "sans-serif",
            }}
          >
            &amp; chrome delete.
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
            {`${CERTIFICATION}  ·  ${BUSINESS.phone}`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
