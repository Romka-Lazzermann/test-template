'use client'

import Script from "next/script"
import LinkSnippetCard from "../link-snippet-card"
import { postData } from '@/lib/api'
export default function QueryResultsBlock(props: any) {
    const { impressionID, items, query } = props;
    const clickImpression = async () => {
        if (impressionID) {
            const res = await postData(`${process.env.NEXT_PUBLIC_API_URL}/api/impression/clicked`, { impression_id: impressionID })
        } else {
            console.log("no impression")
        }
    }
    return (
        <div className="space-y-8">
            <div >
                <header className="bg-card p-4 sm:p-6 rounded-lg shadow-sm">
                    <h1 className="text-2xl sm:text-3xl font-semibold mb-4 text-center text-foreground">
                        {query ? `Search Results for "${query}"` : 'Search Articles'}
                    </h1>
                </header>
            </div>
            <button onClick={clickImpression}>
                Click me
            </button>

            <script type='text/javascript'
                dangerouslySetInnerHTML={{
                    __html: `
      window.global = {
        csa: "relatedsearch",
        hl: "${'123'}",
        styleId: "${'321'}",
        channel: "${'1213'}",
        terms: ${JSON.stringify(["123, 321,123"])},
      };
    `,
                }}

            />



            <Script id="related-search" strategy="lazyOnload">

                {/* hl: "${data.data?.lang}",
            styleId: "${data.data?.styleID}",
            channel: "${data.data?.channel}",
            terms: "${{}}", */}
                {`
          window.global = {
            csa: "relatedsearch",
            
            // relatedSearches: 6,
            // referrerAdCreative: "air conditioner outlet"
          };
        `}

            </Script>
            {items?.length > 0 ? items?.map((item: any, index: any) => {
                return (
                    <div key={`${index}-${item?.title}`}>
                        <LinkSnippetCard
                            title={item?.title}
                            link={item?.link}
                            snippet={item?.snippet}
                            redirect={false}
                        />
                    </div>
                )
            }) : (<></>)}
        </div>
    )
}