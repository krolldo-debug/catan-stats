import { Redis } from '@upstash/redis'

// Works with both Vercel KV and Upstash env var naming conventions
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
})

const KEY = 'catan:data'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const data = await redis.get(KEY)
      return res.status(200).json(data || null)
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      if (!body || !Array.isArray(body.gameNights)) {
        return res.status(400).json({ error: 'Invalid payload' })
      }
      await redis.set(KEY, {
        gameNights: body.gameNights,
        duoCarl: body.duoCarl || [],
        duoDante: body.duoDante || [],
        updatedAt: new Date().toISOString(),
      })
      return res.status(200).json({ ok: true })
    }

    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Server error' })
  }
}
