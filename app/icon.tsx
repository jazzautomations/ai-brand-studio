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
          borderRadius: 8,
          background: "linear-gradient(135deg, #1E3A5F 0%, #D4A853 100%)",
          color: "#FFFFFF",
          fontSize: 16,
          fontWeight: 700,
          fontFamily: "system-ui",
          letterSpacing: "-0.5px",
        }}
      >
        F
      </div>
    ),
    { ...size },
  );
}
