'use client';

import EllipsisOutlined from '@ant-design/icons/EllipsisOutlined';
import { ConfigProvider, Tabs as AntTabs } from 'antd';
import type { TabsProps as AntTabsProps } from 'antd';
import * as React from 'react';
import { DEFAULT_LABELS, useLabels } from '../lib/labels.js';

export interface TabsProps extends Omit<AntTabsProps, 'more'> {
  more?: NonNullable<AntTabsProps['more']> & { 'aria-label'?: string };
}

const TabsRoot = React.forwardRef<React.ComponentRef<typeof AntTabs>, TabsProps>(function TabsRoot(
  { more, moreIcon, ...props },
  ref,
) {
  const labels = useLabels();
  const config = React.useContext(ConfigProvider.ConfigContext);
  const { 'aria-label': callerLabel, ...moreProps } = more ?? {};
  const label = callerLabel ?? labels.moreTabs ?? DEFAULT_LABELS.moreTabs;
  const icon = moreProps.icon
    ?? config.tabs?.more?.icon
    ?? config.tabs?.moreIcon
    ?? moreIcon
    ?? <EllipsisOutlined />;

  return (
    <AntTabs
      {...props}
      ref={ref}
      more={{ ...moreProps, icon: <span role="img" aria-label={label}>{icon}</span> }}
    />
  );
});

TabsRoot.displayName = 'Tabs';

export const Tabs = Object.assign(TabsRoot, { TabPane: AntTabs.TabPane });
