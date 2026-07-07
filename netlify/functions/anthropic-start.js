import { randomUUID } from 'node:crypto';
import { getStore } from '@netlify/blobs';

const JOB_TTL_SECONDS = 60 * 60;

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  if (!Array.isArray(body?.messages)) {
    return new Response(JSON.stringify({ error: 'messages array required' }), { status: 400 });
  }

  const jobId = randomUUID();
  const store = getStore('anthropic-jobs');
  await store.set(
    jobId,
    JSON.stringify({ status: 'pending', createdAt: Date.now() }),
    { expirationTtl: JOB_TTL_SECONDS }
  );

  const origin = new URL(req.url).origin;
  const dispatchPromise = fetch(`${origin}/.netlify/functions/anthropic-run-background`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId, ...body }),
  }).catch(async () => {
    await store.set(
      jobId,
      JSON.stringify({
        status: 'error',
        message: 'Failed to start inquiry job',
        finishedAt: Date.now(),
      }),
      { expirationTtl: JOB_TTL_SECONDS }
    );
  });

  if (typeof context?.waitUntil === 'function') {
    context.waitUntil(dispatchPromise);
  }

  return new Response(JSON.stringify({ jobId }), {
    status: 202,
    headers: { 'Content-Type': 'application/json' },
  });
};
