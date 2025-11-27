import Image from "next/image";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Animax";
    const type = searchParams.get("type") || "";
    const imageUrl = searchParams.get("image");

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1a1b1e",
            position: "relative",
          }}
        >
          {/* Background gradient */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(to bottom right, rgba(79, 70, 229, 0.2), rgba(0, 0, 0, 0.8))",
              zIndex: 0,
            }}
          />

          {/* Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={title}
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginBottom: "20px",
                }}
              />
            )}
            <h1
              style={{
                fontSize: "60px",
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
                marginBottom: "10px",
                padding: "0 20px",
              }}
            >
              {title}
            </h1>
            {type && (
              <p
                style={{
                  fontSize: "30px",
                  color: "#9ca3af",
                  textAlign: "center",
                }}
              >
                {type}
              </p>
            )}
          </div>

          {/* Logo watermark */}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#6366f1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              A
            </div>
            <span
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                background: "linear-gradient(to right, #6366f1, #9ca3af)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Animax
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    if (e instanceof Error) {
      console.log(`${e.message}`);
    } else {
      console.log("An unknown error occurred");
    }
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
