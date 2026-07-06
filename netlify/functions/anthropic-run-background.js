import { getStore } from '@netlify/blobs';

const JOB_TTL_SECONDS = 60 * 60;

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), { status: 500 });
  }

  const store = getStore('anthropic-jobs');

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  const { jobId, messages, max_tokens = 2000, system } = body;
  if (!jobId || !Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: 'jobId and messages are required' }), { status: 400 });
  }

  await store.set(
    jobId,
    JSON.stringify({ status: 'running', startedAt: Date.now() }),
    { expirationTtl: JOB_TTL_SECONDS }
  );

  try {
    const payload = {
      model: 'claude-haiku-4-5-20251001',
      max_tokens,
      messages,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    };
    if (system) payload.system = system;

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'web-search-2025-03-05',
      },
      body: JSON.stringify(payload),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      await store.set(
        jobId,
        JSON.stringify({
          status: 'error',
          code: upstream.status,
          message: data?.error?.message || 'Upstream request failed',
          finishedAt: Date.now(),
        }),
        { expirationTtl: JOB_TTL_SECONDS }
      );
      return new Response(JSON.stringify({ ok: false }), { status: 200 });
    }

    await store.set(
      jobId,
      JSON.stringify({ status: 'done', data, finishedAt: Date.now() }),
      { expirationTtl: JOB_TTL_SECONDS }
    );

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    await store.set(
      jobId,
      JSON.stringify({
        status: 'error',
        message: error?.message || 'Unexpected failure',
        finishedAt: Date.now(),
      }),
      { expirationTtl: JOB_TTL_SECONDS }
    );
    return new Response(JSON.stringify({ ok: false }), { status: 200 });
  }
};
