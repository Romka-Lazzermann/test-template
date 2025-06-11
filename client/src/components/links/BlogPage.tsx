'use client'

import { useLinkData } from '@/hooks/useLinkData'
import { useSearchParams } from 'next/navigation'
import Script from 'next/script';
import Image from 'next/image';
import LinkSnippetCard from '../link-snippet-card';
export default function BlogClient({
  slug,
  lang,
}: {
  slug: string
  lang: string,
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
  const keywords : [] = data.data.keywords
  return (
    <div>

      <div dangerouslySetInnerHTML={{ __html: data.data.title }} />
      {keywords?.map((keyword, index) => (
        <LinkSnippetCard
          link={`/article/query?q=${keyword}`}
          snippet=''
          title={keyword}
          key={`${keyword}-${index}`}
          redirect={false}
        />
      ))}
      <script type='text/javascript'
        dangerouslySetInnerHTML={{
          __html: `
      window.global = {
            csa: "relatedsearch",
            hl: "${data.data?.lang}",
            styleId: "${data.data?.styleID}",
            channel: "${data.data?.channel}",
            resultsPageBaseUrl: "${process.env.NEXT_PUBLIC_SITE_DOMAIN}/blog/query",
            terms: "${keywords}",
            // relatedSearches: 6,
            // referrerAdCreative: "air conditioner outlet"
          };
    `,
        }}

      />
      {/* <Script id="related-search" strategy="afterInteractive">
        {`
          window.global = {
            csa: "relatedsearch",
            hl: "${data.data?.lang}",
            styleId: "${data.data?.styleID}",
            channel: "${data.data?.channel}",
            resultsPageBaseUrl: "${process.env.NEXT_PUBLIC_SITE_DOMAIN}/blog/query",
            terms: "${keywords}",
            // relatedSearches: 6,
            // referrerAdCreative: "air conditioner outlet"
          };
        `}
      </Script> */}

      <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden shadow-md mb-6 sm:mb-8">
        <Image
          src={data.data.img}
          alt={data.data.title}
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
      <div dangerouslySetInnerHTML={{ __html: data.data.description }} />


    </div>
  )
}
