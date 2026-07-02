import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function anthropicDevProxy(apiKey) {
  return {
    name: 'anthropic-dev-proxy',
    configureServer(server) {
      server.middlewares.use('/.netlify/functions/anthropic', async (req, res, next) => {
        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
          res.end()
          return
        }

        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        if (!apiKey) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Server misconfigured' }))
          return
        }

        try {
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const rawBody = Buffer.concat(chunks).toString('utf8')
          const body = JSON.parse(rawBody || '{}')

          const { messages, max_tokens = 2000, system, tools } = body
          if (!Array.isArray(messages)) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'messages array required' }))
            return
          }

          const payload = { model: 'claude-sonnet-4-6', max_tokens, messages }
          if (system) payload.system = system
          if (tools && Array.isArray(tools)) payload.tools = tools

          const upstream = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01',
              'anthropic-beta': 'web-search-2025-03-05',
            },
            body: JSON.stringify(payload),
          })

          const data = await upstream.text()
          res.statusCode = upstream.status
          res.setHeader('Content-Type', 'application/json')
          res.end(data)
        } catch {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Invalid JSON body' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiKey = env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY

  return {
    plugins: [react(), anthropicDevProxy(apiKey)],
    server: {
      port: 5173,
      fs: {
        allow: ['..']
      }
    },
    build: {
      rollupOptions: {
        external: [],
      }
    }
  }
})
