import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = {
  width: 512,
  height: 512,
};

export default function Icon() {
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
            "radial-gradient(circle at 25% 25%, rgba(234,215,166,0.95), rgba(197,160,89,1) 38%, rgba(93,64,55,1) 68%, rgba(29,21,18,1) 100%)",
        }}
      >
        <div
          style={{
            height: 392,
            width: 392,
            borderRadius: 112,
            border: "10px solid rgba(253,251,247,0.14)",
            background: "rgba(48, 37, 32, 0.52)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              color: "white",
              fontFamily: "Avenir Next, Inter, sans-serif",
            }}
          >
            <div
              style={{
                height: 160,
                width: 160,
                borderRadius: 48,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.06))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 78,
                fontWeight: 700,
              }}
            >
              A
            </div>
            <div style={{ fontSize: 52, fontWeight: 700, letterSpacing: "-0.04em" }}>
              AdmiAmigo 360
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
