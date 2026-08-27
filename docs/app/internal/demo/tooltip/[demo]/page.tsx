import { TooltipIframeDemo } from '../../../../../components/data-display/tooltip/iframe-demo';

export function generateStaticParams() {
  return ['shift'].map((demo) => ({ demo }));
}

export default async function TooltipDemoPage({ params }: { params: Promise<{ demo: string }> }) {
  return <TooltipIframeDemo demo={(await params).demo} />;
}
