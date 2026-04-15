import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = {
  width: 180,
  height: 180,
};

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 30% 25%, rgba(234,215,166,1), rgba(197,160,89,1) 44%, rgba(93,64,55,1) 72%, rgba(29,21,18,1) 100%)",
          borderRadius: 42,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 120,
            width: 120,
            borderRadius: 32,
            background: "rgba(48,37,32,0.38)",
            color: "white",
            fontFamily: "Avenir Next, Inter, sans-serif",
            fontSize: 64,
            fontWeight: 700,
            border: "4px solid rgba(253,251,247,0.12)",
          }}
        >
          A
        </div>
      </div>
    ),
    size,
  );
}
