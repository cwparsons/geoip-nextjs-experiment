import { geolocation } from "@vercel/functions";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const geo = geolocation(request);

  const headers = new Headers({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    "Surrogate-Control": "no-store",
  });

  return new Response(JSON.stringify(geo), { headers });
}
