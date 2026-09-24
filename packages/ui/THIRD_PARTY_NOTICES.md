# Third-party notices

`@ceebee/ui` includes software from the projects below. Most are MIT-licensed; the one Apache-2.0
dependency names its licence in its own section.

## Ant Design

Copyright © 2015-present Ant UED

`@ceebee/ui/client` re-exports the Ant Design 6.6.1 runtime, themed by Ceebee's Tokens and Skins.
Ant Design is licensed under the MIT License, and its copyright notice is retained here.

The documentation's examples are vendored verbatim from Ant Design 6.6.1 at commit
`164a310f742f801c49b3ff748b2823d5596104bd`, differing only by the client directive and the
`@ceebee/ui/client` import path. `docs/component-sources.json` records the lineage per component.

## @ant-design/icons

Copyright © 2015-present Ant UED

Icon components come from `@ant-design/icons` 6.x, a peer dependency. It is licensed under the MIT
License.

## React Flow (@xyflow/react)

Copyright © 2019-present webkid GmbH

`Diagram` and `DiagramEditor` in `@ceebee/ui/client` are built on the `@xyflow/react` 12.11.6 runtime,
a dependency. Its base stylesheet is included in `styles.css`, and its appearance is set by Ceebee's
Tokens. React Flow is licensed under the MIT License, and its copyright notice is retained here.

## dayjs

Copyright © 2018-present iamkun

Date and time components use `dayjs` 1.11.18 as their date engine. It is licensed under the MIT
License.

## SVAR React Gantt

Copyright © 2025 XB Software Sp. z o.o

`Schedule` in `@ceebee/ui/client` draws its grid and bars with `@svar-ui/react-gantt` 2.7.3, a
dependency. Its base stylesheet is included in `styles.css`, and its appearance is set by Ceebee's
Tokens through the substrate's `--wx-*` custom properties. It is licensed under the MIT License, and
its copyright notice is retained here.

The package manifest carries `"productTrial": true`, but that is build metadata: the published licence
is MIT, there is no runtime licence key, and no trial watermark is present in the bundle. Its **PRO**
edition gates other features — vertical markers, critical path, baselines, auto-scheduling — and
`Schedule` does not use them; see the component's documentation page for what the free build does not
draw.

## @dnd-kit

Copyright © 2021, Claudéric Demers

`Board` in `@ceebee/ui/client` uses `@dnd-kit/core` 6.3.1, `@dnd-kit/sortable` 10.0.0 and
`@dnd-kit/utilities` 3.2.2 as its drag-and-drop runtime. They are licensed under the MIT License.

## Lightweight Charts™

Copyright © 2023 TradingView, Inc.

`ProgressCurve` in `@ceebee/ui/client` draws its canvas with `lightweight-charts` 5.2.1, a
dependency loaded on demand. It is licensed under the **Apache License, Version 2.0**; a copy is in
the package at `node_modules/lightweight-charts/LICENSE`, and the attribution is retained here
rather than painted into a consumer's chart, where the library's `attributionLogo` option is turned
off.
