// Simple in-memory rate limiting
interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  rateLimitMap.forEach((entry, key) => {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key)
    }
  })
}, 5 * 60 * 1000)

export const ratelimit = {
  limit: async (identifier: string) => {
    const now = Date.now()
    const windowMs = 10 * 1000 // 10 seconds
    const maxRequests = 10
    
    const entry = rateLimitMap.get(identifier)
    
    if (!entry || now > entry.resetTime) {
      // First request or window expired
      rateLimitMap.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      })
      
      return {
        success: true,
        limit: maxRequests,
        remaining: maxRequests - 1,
        reset: new Date(now + windowMs),
      }
    }
    
    if (entry.count >= maxRequests) {
      // Rate limit exceeded
      return {
        success: false,
        limit: maxRequests,
        remaining: 0,
        reset: new Date(entry.resetTime),
      }
    }
    
    // Increment count
    entry.count++
    
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - entry.count,
      reset: new Date(entry.resetTime),
    }
  },
}

export const rateLimiter = ratelimit