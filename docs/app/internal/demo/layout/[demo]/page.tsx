import { LayoutIframeDemo } from '../../../../../components/layout/layout/iframe-demo';

export function generateStaticParams() {
  return ["side", "fixed", "fixed-sider"].map((demo) => ({ demo }));
}

export default async function LayoutDemoPage({ params }: { params: Promise<{ demo: string }> }) {
  return <LayoutIframeDemo demo={(await params).demo} />;
}
