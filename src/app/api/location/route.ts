import { geolocation } from "@vercel/functions";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const geo = geolocation(request);

  return Response.json(geo);
}
