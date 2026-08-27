'use client';

import React from 'react';
import { Calendar, Col, Radio, Row, Select } from '@ceebee/ui/client';
import type { CalendarProps, SelectProps } from '@ceebee/ui/client';
import { createStyles } from 'antd-style';

// This type is not re-exported from the main entry upstream.
// Select's own public options type describes the same shape.
type DefaultOptionType = NonNullable<SelectProps['options']>[number];
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

/* A calendar often has to carry a second layer of meaning alongside the date —
   a holiday, a sprint, a fiscal period. This one annotates each cell with the
   holiday it falls on, or the ISO week it opens. */
const HOLIDAYS: Record<string, string> = {
  '01-01': 'New Year',
  '02-14': "Valentine's",
  '05-01': 'Labour Day',
  '06-21': 'Solstice',
  '10-31': 'Halloween',
  '12-24': 'Christmas Eve',
  '12-25': 'Christmas',
  '12-31': "New Year's Eve",
};

const QUARTER_OF = (month: number) => `Q${Math.floor(month / 3) + 1}`;

const useStyle = createStyles(({ cssVar, token, css, cx }) => {
  const note = css`
    color: ${token.colorTextTertiary};
    font-size: ${token.fontSizeSM}px;
  `;
  const weekend = css`
    color: ${token.colorError};
    &.gray {
      opacity: 0.4;
    }
  `;
  return {
    wrapper: css`
      width: 450px;
      border: ${token.lineWidth}px ${token.lineType} ${token.colorBorderSecondary};
      border-radius: ${token.borderRadiusOuter};
      padding: 5px;
    `,
    dateCell: css`
      position: relative;
      &:before {
        content: '';
        position: absolute;
        inset-inline-start: 0;
        inset-inline-end: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        max-width: 40px;
        max-height: 40px;
        background: transparent;
        transition: background-color ${cssVar.motionDurationSlow};
        border-radius: ${token.borderRadiusOuter}px;
        border: ${token.lineWidth}px ${token.lineType} transparent;
        box-sizing: border-box;
      }
      &:hover:before {
        background: ${token.controlItemBgHover};
      }
    `,
    today: css`
      &:before {
        border: ${token.lineWidth}px ${token.lineType} ${token.colorPrimary};
      }
    `,
    text: css`
      position: relative;
      z-index: 1;
    `,
    note,
    current: css`
      color: ${token.colorTextLightSolid};
      &:before {
        background: ${token.colorPrimary};
      }
      &:hover:before {
        background: ${token.colorPrimary};
        opacity: 0.8;
      }
      .${cx(note)} {
        color: ${token.colorTextLightSolid};
        opacity: 0.9;
      }
      .${cx(weekend)} {
        color: ${token.colorTextLightSolid};
      }
    `,
    monthCell: css`
      width: 120px;
      color: ${token.colorTextBase};
      border-radius: ${token.borderRadiusOuter}px;
      padding: 5px 0;
      &:hover {
        background: ${token.controlItemBgHover};
      }
    `,
    monthCellCurrent: css`
      color: ${token.colorTextLightSolid};
      background: ${token.colorPrimary};
      &:hover {
        background: ${token.colorPrimary};
        opacity: 0.8;
      }
    `,
    weekend,
  };
});

const App: React.FC = () => {
  const { styles } = useStyle({ test: true });

  const [selectDate, setSelectDate] = React.useState<Dayjs>(() => dayjs());
  const [panelDate, setPanelDate] = React.useState<Dayjs>(() => dayjs());

  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
    console.log(value.format('YYYY-MM-DD'), mode);
    setPanelDate(value);
  };

  const onDateChange: CalendarProps<Dayjs>['onSelect'] = (value) => {
    setSelectDate(value);
  };

  const cellRender: CalendarProps<Dayjs>['fullCellRender'] = (date, info) => {
    const isWeekend = date.day() === 6 || date.day() === 0;
    const holiday = HOLIDAYS[date.format('MM-DD')];
    const weekOpener = date.isoWeekday() === 1 ? `W${date.isoWeek()}` : undefined;

    if (info.type === 'date') {
      return React.cloneElement(info.originNode, {
        ...(info.originNode as React.ReactElement<any>).props,
        className: clsx(styles.dateCell, {
          [styles.current]: selectDate.isSame(date, 'date'),
          [styles.today]: date.isSame(dayjs(), 'date'),
        }),
        children: (
          <div className={styles.text}>
            <span
              className={clsx({
                [styles.weekend]: isWeekend,
                gray: !panelDate.isSame(date, 'month'),
              })}
            >
              {date.get('date')}
            </span>
            <div className={styles.note}>{holiday || weekOpener}</div>
          </div>
        ),
      });
    }

    if (info.type === 'month') {
      return (
        <div
          className={clsx(styles.monthCell, {
            [styles.monthCellCurrent]: selectDate.isSame(date, 'month'),
          })}
        >
          {date.format('MMM')} ({QUARTER_OF(date.get('month'))})
        </div>
      );
    }
  };

  const getYearLabel = (year: number) => `${year}`;

  const getMonthLabel = (month: number, value: Dayjs) =>
    `${value.month(month).format('MMMM')} (${QUARTER_OF(month)})`;

  return (
    <div className={styles.wrapper}>
      <Calendar
        fullCellRender={cellRender}
        fullscreen={false}
        onPanelChange={onPanelChange}
        onSelect={onDateChange}
        headerRender={({ value, type, onChange, onTypeChange }) => {
          const start = 0;
          const end = 12;
          const monthOptions: DefaultOptionType[] = [];

          for (let i = start; i < end; i++) {
            monthOptions.push({
              label: getMonthLabel(i, value),
              value: i,
            });
          }

          const year = value.year();
          const month = value.month();
          const options: DefaultOptionType[] = [];
          for (let i = year - 10; i < year + 10; i += 1) {
            options.push({
              label: getYearLabel(i),
              value: i,
            });
          }
          return (
            <Row justify="end" gutter={8} style={{ padding: 8 }}>
              <Col>
                <Select
                  size="small"
                  popupMatchSelectWidth={false}
                  className="my-year-select"
                  value={year}
                  options={options}
                  onChange={(newYear) => {
                    const now = value.clone().year(newYear);
                    onChange(now);
                  }}
                />
              </Col>
              <Col>
                <Select
                  size="small"
                  popupMatchSelectWidth={false}
                  value={month}
                  options={monthOptions}
                  onChange={(newMonth) => {
                    const now = value.clone().month(newMonth);
                    onChange(now);
                  }}
                />
              </Col>
              <Col>
                <Radio.Group
                  size="small"
                  onChange={(e) => onTypeChange(e.target.value)}
                  value={type}
                >
                  <Radio.Button value="month">Month</Radio.Button>
                  <Radio.Button value="year">Year</Radio.Button>
                </Radio.Group>
              </Col>
            </Row>
          );
        }}
      />
    </div>
  );
};

export default App;
