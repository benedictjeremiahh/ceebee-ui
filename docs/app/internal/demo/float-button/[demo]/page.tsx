import { FloatButtonIframeDemo } from '../../../../../components/general/float-button/iframe-demo';

export function generateStaticParams() {
  return ["basic", "type", "shape", "content", "tooltip", "group", "group-menu", "controlled", "placement", "draggable", "back-top", "progress-ring", "badge", "style-class"].map((demo) => ({ demo }));
}

export default async function FloatButtonDemoPage({ params }: { params: Promise<{ demo: string }> }) {
  return <FloatButtonIframeDemo demo={(await params).demo} />;
}
