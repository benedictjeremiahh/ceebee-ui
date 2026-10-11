'use client';

import { Button as AntButton, ConfigProvider } from 'antd';
import type { ButtonProps as AntButtonProps, GetRef } from 'antd';
import { useContext, useId, useLayoutEffect } from 'react';
import type { RefAttributes } from 'react';

export type ButtonProps = AntButtonProps;

/**
 * The default loading icon is decorative, including during its exit animation.
 *
 * Ant 6.6.1 names its outer LoadingOutlined span "loading" while hiding only the inner SVG.
 * That changes the action's accessible name during loading and while the exit node remains.
 * The pinned default icon wrapper is the boundary: caller icons and global custom loading icons
 * are outside it and retain their semantics. Observe it because upstream motion owns its lifetime.
 * No icon replacement, extra layout box, or motion/activation change is introduced.
 * Remove this adapter once upstream hides its default outer icon and the regressions pass.
 */
function ButtonRoot({ id, ref, ...props }: ButtonProps & RefAttributes<GetRef<typeof AntButton>>) {
  const generatedId = useId();
  const buttonId = id ?? generatedId;
  const config = useContext(ConfigProvider.ConfigContext);
  const prefix = config.getPrefixCls('btn', props.prefixCls);

  useLayoutEffect(() => {
    const root = document.getElementById(buttonId);
    if (!root) return;
    // Idle buttons need no observer; a parent loading change runs this effect before icon insertion.
    if (!props.loading && root.getElementsByClassName(`${prefix}-loading-icon`).length === 0) return;
    const hideDefaultIcon = () => {
      for (const wrapper of root.getElementsByClassName(`${prefix}-loading-icon`)) {
        for (const icon of wrapper.querySelectorAll('[role="img"][aria-label="loading"]')) {
          if (icon.getAttribute('aria-hidden') !== 'true') icon.setAttribute('aria-hidden', 'true');
        }
      }
    };
    hideDefaultIcon();
    const observer = new MutationObserver(hideDefaultIcon);
    observer.observe(root, { childList: true, subtree: true, attributes: true,
      attributeFilter: ['aria-label', 'aria-hidden'] });
    return () => observer.disconnect();
  });

  return <AntButton {...props} id={buttonId} ref={ref} />;
}

export const Button: typeof AntButton = Object.assign(ButtonRoot, AntButton);
