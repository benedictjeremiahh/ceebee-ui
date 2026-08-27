'use client';

import React from 'react';
import { Divider, Typography } from '@ceebee/ui/client';

const { Title, Paragraph, Text, Link } = Typography;

const blockContent = `Ceebee Charts is the data visualisation layer of this system: a small set of chart primitives that read the same tokens every other component reads, so a dashboard stays legible when the skin, the colour scheme, or the density changes.
It covers the everyday shapes — trends, distributions, comparisons, and single-figure summaries — and leaves the exotic ones to a dedicated charting library.`;

const App: React.FC = () => (
  <Typography>
    <Title>Introduction</Title>

    <Paragraph>
      In the process of internal desktop applications development, many different design specs and
      implementations would be involved, which might cause designers and developers difficulties and
      duplication and reduce the efficiency of development.
    </Paragraph>

    <Paragraph>
      After massive project practice and summaries, Ceebee UI, a design language for background
      applications, is refined by the Ceebee team, which aims to{' '}
      <Text strong>
        uniform the user interface specs for internal background projects, lower the unnecessary
        cost of design differences and implementation and liberate the resources of design and
        front-end development
      </Text>
      .
    </Paragraph>

    <Title level={2}>Guidelines and Resources</Title>

    <Paragraph>
      We supply a series of design principles, practical patterns and high quality design resources
      (<Text code>Sketch</Text> and <Text code>Axure</Text>), to help people create their product
      prototypes beautifully and efficiently.
    </Paragraph>

    <Paragraph>
      <ul>
        <li>
          <Link href="/docs/spec/proximity">Principles</Link>
        </li>
        <li>
          <Link href="/docs/spec/overview">Patterns</Link>
        </li>
        <li>
          <Link href="/docs/resources">Resource Download</Link>
        </li>
      </ul>
    </Paragraph>

    <Paragraph>
      Press <Text keyboard>Esc</Text> to exit...
    </Paragraph>

    <Divider />

    <Title>Background</Title>

    <Paragraph>
      An enterprise product is a large and complicated system. Such products are not only big in
      scope and rich in behaviour, they also change often and are worked on by many people at once,
      so design and engineering both have to be able to answer quickly. They also repeat themselves:
      the same page shapes and the same components turn up again and again, which is exactly what
      makes them worth abstracting into something stable and reusable.
    </Paragraph>

    <Paragraph>
      As these products became commercial offerings, the bar for the experience rose with them. With
      that as the goal, and after a great deal of project work, we settled on a design system built
      for enterprise products: Ceebee UI. It rests on the values of{' '}
      <Text mark>certainty and naturalness</Text>, and it uses a modular approach to cut the cost of
      producing the same thing twice, so that designers can spend their attention on{' '}
      <Text strong>a better user experience</Text>.
    </Paragraph>

    <Title level={2}>Design resources</Title>

    <Paragraph>
      We publish the design principles, the patterns worth copying, and the source files (
      <Text code>Sketch</Text> and <Text code>Axure</Text>) so a team can get to a high-quality
      prototype quickly.
    </Paragraph>

    <Paragraph>
      <ul>
        <li>
          <Link href="/docs/spec/proximity">Design principles</Link>
        </li>
        <li>
          <Link href="/docs/spec/overview">Design patterns</Link>
        </li>
        <li>
          <Link href="/docs/resources">Design resources</Link>
        </li>
      </ul>
    </Paragraph>

    <Paragraph>
      <blockquote>{blockContent}</blockquote>
      <pre>{blockContent}</pre>
    </Paragraph>

    <Paragraph>
      Press <Text keyboard>Esc</Text> to stop reading…
    </Paragraph>
  </Typography>
);

export default App;
