// types/movie.ts
export interface Movie {
  id: number
  title: string
  year: number
  img: string
  rating?: number
  genres?: string
  runtime?: number
  overview?: string

  // optional สำหรับ history / watchlist
  viewedAt?: string
  isViewed?: boolean
}
