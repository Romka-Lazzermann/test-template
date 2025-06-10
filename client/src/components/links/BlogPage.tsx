'use client'

import { useLinkData } from '@/hooks/useLinkData'
import { useSearchParams } from 'next/navigation'
import Script from 'next/script';

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
  const { data, isLoading, isError } = useLinkData(slug, lang, params)
  if (isLoading) return <div>Loading...</div>
  if (isError || !data) return <div>Error loading blog</div>
  
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: data.data.title }} />
      <div dangerouslySetInnerHTML={{ __html: data.data.description }} />
      {data.data?.keywords}
       <Script id="related-search" strategy="afterInteractive">
        {`
          window.global = {
            csa: "relatedsearch",
            hl: "${data.data?.lang}",
            styleId: "${data.data?.styleID}",
            channel: "${data.data?.channel}",
            resultsPageBaseUrl: "${process.env.NEXT_PUBLIC_SITE_DOMAIN}/blog/query",
            terms: "${data.data?.keywords}",
            // relatedSearches: 6,
            // referrerAdCreative: "air conditioner outlet"
          };
        `}
      </Script> 
    </div>
  )
}
