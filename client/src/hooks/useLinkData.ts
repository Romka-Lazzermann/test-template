'use client'

import { useEffect, useState } from 'react'

export function useLinkData(slug: string, lang: string, searchParams: Record<string, string>) {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!slug || !lang) return

    const query = new URLSearchParams({ lang, ...searchParams }).toString()
    const url = `/api/link/${slug}?${query}&setCookie=impression_id&cookieField=impression_id`

    setIsLoading(true)
    setError(null)

    fetch(url, {
        method: "GET",
         headers: {
            'Content-Type': 'application/json'
        },
    })
      .then(res => {
        if (!res.ok) throw new Error(`Error: ${res.status}`)
        return res.json()
      })
      .then(json => {
        setData(json)
        setIsLoading(false)
      })
      .catch(err => {
        setError(err)
        setIsLoading(false)
      })
  }, [slug, lang, JSON.stringify(searchParams)])

  return { data, isLoading, isError: error }
}