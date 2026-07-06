// Server-side proxy for the Anthropic API.
// Forwards system prompt, messages, tools (web search), and max_tokens.
export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Server misconfigured" }), { status: 500 });
  }
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400 });
  }
  const { messages, max_tokens: requestedMaxTokens, system, tools } = body;
  if (!Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: "messages array required" }), { status: 400 });
  }
  // Cap response length so generation finishes faster (Netlify function time limit)
  const max_tokens = Math.min(requestedMaxTokens || 1200, 1200);
  const payload = { model: "claude-haiku-4-5-20251001", max_tokens, messages };
  if (system) payload.system = system;
  // Server-side allowlist: only web_search permitted, capped at 3 searches so
  // the whole request finishes well within Netlify's function timeout
  payload.tools = [{ type: 'web_search_20250305', name: 'web_search', max_uses: 3 }];
  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "web-search-2025-03-05",
    },
    body: JSON.stringify(payload),
  });
  const data = await upstream.json();
  return new Response(JSON.stringify(data), {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
};
