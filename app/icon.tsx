import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
          background: "linear-gradient(135deg, #E63946 0%, #0F1B2D 100%)",
          color: "#FAF8F5",
          fontSize: 18,
          fontWeight: 700,
          fontFamily: "system-ui",
        }}
      >
        F
      </div>
    ),
    { ...size },
  );
}
