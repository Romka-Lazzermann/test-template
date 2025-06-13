'use client'

import { useEffect, useState } from 'react'
import DOMPurify from 'dompurify';

export function useLinkData(slug: string, lang: string, searchParams: Record<string, string>) {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!slug || !lang) return

    const query = new URLSearchParams({ lang, ...searchParams }).toString()
    const url = `/proxy/link/${slug}?${query}&setCookie=impression_id&cookieField=impression_id`
    console.log("link url", url)
    setIsLoading(true)
    setError(null)

    fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(res => {
        console.log("fetch article")
        if (!res.ok) throw new Error(`Error: ${res.status}`)
        return res.json()
      })
      .then(json => {
        try {
          // json.data.keywords = json.data.keywords.replace(/\\/g, "");
          json.data.keywords = JSON.parse(json.data.keywords)
          json.data.title = DOMPurify.sanitize(json.data.title)
          json.data.description = DOMPurify.sanitize(json.data.description)
        } catch (err) {
          console.error("parse error", err)
        }
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