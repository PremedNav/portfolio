import { getAllLabSlugs, getLabExperiment, LAB_EXPERIMENTS } from '@/lib/lab';
import LabDetailContent from './LabDetailContent';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return getAllLabSlugs().map((slug) => ({ slug }));
}

export default function LabPage({ params }: { params: { slug: string } }) {
  const experiment = getLabExperiment(params.slug);
  if (!experiment) notFound();

  return <LabDetailContent experiment={experiment} allExperiments={LAB_EXPERIMENTS} />;
}
