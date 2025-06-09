// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'

type BlogData = {
  title: string
  description: string
}

async function getBlogData(slug: string, lang: string): Promise<any | null> {
  try {
    const res = await fetch(`${process.env.SERVER_URL}/api/link/${slug}?lang=${lang}`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export default async function BlogPage({ params }: { params: { lang: string, slug: string } }) {
  const {lang, slug} = await params;
  const data = await getBlogData(slug, lang)
  if (!data) return notFound()

  return (
    <main className="p-6">
        {data?.data.title}
        {data?.data.description}
      {/* <h1 className="text-3xl font-bold mb-4"></h1>
      <p className="text-lg text-gray-700"></p> */}
      
    </main>
  )
}