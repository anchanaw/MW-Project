import { defineEventHandler, getQuery, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = query.q as string

  if (!q) {
    return { results: [] }
  }

  const res = await fetch(
    `https://imdbapi.dev/search?q=${encodeURIComponent(q)}`
  )

  if (!res.ok) {
    throw createError({
      statusCode: res.status,
      statusMessage: 'IMDb API error'
    })
  }
  console.log('🔥 /api/search is called')

  return await res.json()
})
