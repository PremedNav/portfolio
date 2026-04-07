import { LAB_EXPERIMENTS } from '@/lib/lab';
import LabListContent from './LabListContent';

export default function LabPage() {
  return <LabListContent experiments={LAB_EXPERIMENTS} />;
}
