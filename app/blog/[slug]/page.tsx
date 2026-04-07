import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllSlugs, getPostBySlug, getAllPosts } from '@/lib/blog'
import { mdxComponents } from './mdx-components'
import BlogPostContent from './BlogPostContent'

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { meta, content, toc } = getPostBySlug(params.slug)
  const allPosts = getAllPosts()

  return (
    <BlogPostContent meta={meta} toc={toc} allPosts={allPosts}>
      <MDXRemote source={content} components={mdxComponents} />
    </BlogPostContent>
  )
}
