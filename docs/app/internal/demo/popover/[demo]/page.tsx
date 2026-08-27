import { PopoverIframeDemo } from '../../../../../components/data-display/popover/iframe-demo';

export function generateStaticParams() {
  return ['shift'].map((demo) => ({ demo }));
}

export default async function PopoverDemoPage({ params }: { params: Promise<{ demo: string }> }) {
  return <PopoverIframeDemo demo={(await params).demo} />;
}
