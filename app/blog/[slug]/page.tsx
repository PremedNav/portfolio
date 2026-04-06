import BlogPostContent from './BlogPostContent'

const ALL_SLUGS = [
  'building-medical-ai',
  'prompt-engineering',
  'llm-cost-optimization',
  'eval-driven-development',
  'training-12b-model',
  'biochemical-pathway-discovery',
  'building-premeder',
  'designing-ml-language',
  'premed-tech-stack',
  'medical-image-classification',
  'phage-therapy-computational',
  'realtime-data-pipelines',
]

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }))
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <BlogPostContent slug={params.slug} />
}
