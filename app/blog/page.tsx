import { getAllPosts, getCategoryCounts } from '@/lib/blog'
import BlogListContent from './BlogListContent'

export default function BlogPage() {
  const posts = getAllPosts()
  const categories = getCategoryCounts(posts)

  return <BlogListContent posts={posts} categories={categories} />
}
