'use client'

import { useLinkData } from '@/hooks/useLinkData'
import { useSearchParams } from 'next/navigation'

export default function BlogClient({
  slug,
  lang,
}: {
  slug: string
  lang: string
}) {
if (!slug || !lang) {
    return <div>Loading or invalid parameters</div>
  }
  const searchParams = useSearchParams()
  const params: Record<string, string> = {}
  searchParams.forEach((value: any, key: any) => {
    params[key] = value
  })
  const {data, isLoading, isError} = useLinkData(slug, lang, params)
  if (isLoading) return <div>Loading...</div>
  if (isError || !data) return <div>Error loading blog</div>

  return (
    <div>
      <h1>{data.data.title}</h1>
      <p>{data.data.description}</p>
    </div>
  )
}
