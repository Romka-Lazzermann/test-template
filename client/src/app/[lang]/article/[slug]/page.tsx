import BlogClient from '@/components/links/BlogPage'

export default async function BlogPage({ params } : any) {
  const {lang, slug} = await params;
  return <BlogClient  lang={lang} slug={slug} />
}