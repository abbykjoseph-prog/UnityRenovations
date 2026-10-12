import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// Social share image: a "mini hero" built from the first home page hero photo.
export const alt = `${site.name}: renovations and custom builds in Toronto & the GTA`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "20,22,27";
// Same gradient as the live hero: dark behind the text, transparent by about the middle (max 50%)
const GRADIENT = `linear-gradient(90deg, rgba(${INK},0.5) 0%, rgba(${INK},0.47) 36%, rgba(${INK},0.22) 48%, rgba(${INK},0) 56%)`;
// Dark halo around the lettering so it stays readable over bright parts of the photo
const HALO = "0 0 3px rgba(0,0,0,0.85), 0 0 6px rgba(0,0,0,0.6), 0 0 18px rgba(0,0,0,0.4)";

const file = (path: string) => readFile(join(process.cwd(), path));
const dataUrl = async (path: string, mime: string) => `data:${mime};base64,${(await file(path)).toString("base64")}`;

export default async function OpenGraphImage() {
  const [photo, logo, fraunces, inter] = await Promise.all([
    dataUrl("public/images/hero/living-room-panel-moulding.jpg", "image/jpeg"),
    dataUrl("public/images/logo-light.png", "image/png"),
    file("assets/fonts/Fraunces-SemiBold.ttf"),
    file("assets/fonts/Inter-Medium.ttf"),
  ]);

  return new ImageResponse(
    (
      <div style={{ position: "relative", display: "flex", width: "100%", height: "100%", background: `rgb(${INK})` }}>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- rendered to a PNG, not HTML */}
        <img
          src={photo}
          width={size.width}
          height={size.height}
          style={{ position: "absolute", top: 0, left: 0, width: size.width, height: size.height, objectFit: "cover" }}
        />
        {/* Satori has no `inset` shorthand, so size the overlay explicitly */}
        <div style={{ position: "absolute", top: 0, left: 0, width: size.width, height: size.height, display: "flex", backgroundImage: GRADIENT }} />

        {/* Centred 1000x500 safe area so nothing is cropped by iMessage, WhatsApp or Facebook */}
        <div
          style={{
            position: "absolute",
            top: 65,
            left: 100,
            width: 1000,
            height: 500,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- rendered to a PNG, not HTML */}
          <img src={logo} width={208} height={60} style={{ width: 208, height: 60 }} />

          <div style={{ display: "flex", flexDirection: "column", width: 580 }}>
            <div
              style={{
                fontFamily: "Fraunces",
                fontSize: 68,
                lineHeight: 1.04,
                letterSpacing: "-0.015em",
                color: "#ffffff",
                textShadow: HALO,
              }}
            >
              Remodels and rebuilds, crafted without compromise.
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", marginTop: 28 }}>
              <div style={{ width: 40, height: 3, background: "#5CB8EA", marginRight: 16, marginTop: 16 }} />
              <div
                style={{
                  fontFamily: "Inter",
                  fontSize: 26,
                  lineHeight: 1.3,
                  color: "#ffffff",
                  textShadow: HALO,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Break after the comma so the cities read naturally on two short lines */}
                <span>Serving Toronto, Mississauga,</span>
                <span>Brampton & Hamilton</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces, weight: 600, style: "normal" },
        { name: "Inter", data: inter, weight: 500, style: "normal" },
      ],
    },
  );
}
