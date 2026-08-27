import parity from '../parity.generated.json';

interface ApiEntry {
  key: string;
  section: string;
  name: string;
  description: string;
  type: string;
  default: string;
  version: string;
}

interface ComponentRecord {
  api: ApiEntry[];
}

type DocumentedComponent =
  | 'Button'
  | 'FloatButton'
  | 'Typography'
  | 'Icon'
  | 'Divider'
  | 'Flex'
  | 'Grid'
  | 'Layout'
  | 'Masonry'
  | 'Space'
  | 'Splitter'
  | 'Anchor'
  | 'Breadcrumb'
  | 'Dropdown'
  | 'Menu'
  | 'Pagination'
  | 'Steps'
  | 'Tabs'
  | 'Switch'
  | 'AutoComplete'
  | 'Cascader'
  | 'Checkbox'
  | 'Radio'
  | 'Rate'
  | 'ColorPicker'
  | 'DatePicker'
  | 'Form'
  | 'Transfer'
  | 'TreeSelect'
  | 'Mentions'
  | 'InputNumber'
  | 'Slider'
  | 'TimePicker'
  | 'Input'
  | 'Upload'
  | 'Select'
  | 'Avatar'
  | 'Badge'
  | 'Calendar'
  | 'Card'
  | 'Carousel'
  | 'Collapse'
  | 'Descriptions'
  | 'Empty'
  | 'Image'
  | 'List'
  | 'Listy'
  | 'Popover'
  | 'QRCode'
  | 'Segmented'
  | 'Statistic'
  | 'Table'
  | 'Tag'
  | 'Timeline'
  | 'Tooltip'
  | 'Tour'
  | 'Tree'
  | 'Alert'
  | 'Drawer'
  | 'Message'
  | 'Modal'
  | 'Notification'
  | 'Popconfirm'
  | 'Progress'
  | 'Result'
  | 'Skeleton'
  | 'Spin'
  | 'Watermark'
  | 'Affix'
  | 'App'
  | 'BorderBeam'
  | 'ConfigProvider'
  | 'Util';

export function ApiReference({ component }: { component: DocumentedComponent }) {
  const record = (parity.components as Record<string, ComponentRecord>)[component];
  if (!record) return null;

  const sections = record.api.reduce<Map<string, ApiEntry[]>>((groups, entry) => {
    groups.set(entry.section, [...(groups.get(entry.section) ?? []), entry]);
    return groups;
  }, new Map());
  return (
    <div className="docs__api-reference">
      {Array.from(sections, ([section, entries]) => (
        <section key={section}>
          <h3>{section === 'root' ? component : section}</h3>
          <div className="docs__table-scroll">
            <table className="props">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Version</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.key}>
                    <td><code>{entry.name}</code></td>
                    <td>{entry.description || '—'}</td>
                    <td><code>{entry.type || '—'}</code></td>
                    <td><code>{entry.default || '—'}</code></td>
                    <td>{entry.version || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
