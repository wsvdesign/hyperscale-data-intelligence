// Server-side proxy for the EIA (energy data) API.

export default async (req) => {
  const apiKey = process.env.EIA_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Server misconfigured" }), { status: 500 });
  }

  const url = new URL(req.url);
  const path = url.searchParams.get("path");
  if (!path) {
    return new Response(JSON.stringify({ error: "path query param required" }), { status: 400 });
  }

  const upstream = await fetch(`https://api.eia.gov/v2/${path}&api_key=${apiKey}`);
  const data = await upstream.json();
  return new Response(JSON.stringify(data), {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
};
