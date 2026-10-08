'use client';

import { Pagination as AntPagination } from 'antd';
import type { PaginationProps as AntPaginationProps } from 'antd';
import * as React from 'react';

export type PaginationProps = AntPaginationProps;

const PaginationRoot: React.FC<PaginationProps> = ({ itemRender, ...props }) => {
  const renderItem = React.useCallback<NonNullable<AntPaginationProps['itemRender']>>(
    (page, type, originalElement) => {
      const rendered = itemRender ? itemRender(page, type, originalElement) : originalElement;
      if ((type !== 'prev' && type !== 'next')
        || !React.isValidElement<React.ButtonHTMLAttributes<HTMLButtonElement>>(rendered)
        || rendered.type !== 'button') return rendered;

      const onKeyDown = rendered.props.onKeyDown;
      return React.cloneElement(rendered, {
        onKeyDown: (event) => {
          onKeyDown?.(event);
          if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
            event.stopPropagation();
          }
        },
      });
    },
    [itemRender],
  );

  return <AntPagination {...props} itemRender={renderItem} />;
};

PaginationRoot.displayName = 'Pagination';

export const Pagination = PaginationRoot;
