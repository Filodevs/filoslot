import { DaySchedule } from '../../../../../../models/resource';

export const DAYS_OF_WEEK: DaySchedule[] = [
  {
    key: 'mon',
    label: 'LUN',
    enabled: true,
    ranges: [
      { start: '09:00', end: '12:00' },
      { start: '14:00', end: '18:00' },
    ],
  },
  {
    key: 'tue',
    label: 'MAR',
    enabled: true,
    ranges: [
      { start: '09:00', end: '12:00' },
      { start: '14:00', end: '18:00' },
    ],
  },
  {
    key: 'wed',
    label: 'MIÉ',
    enabled: true,
    ranges: [
      { start: '09:00', end: '12:00' },
      { start: '14:00', end: '18:00' },
    ],
  },
  {
    key: 'thu',
    label: 'JUE',
    enabled: true,
    ranges: [
      { start: '09:00', end: '12:00' },
      { start: '14:00', end: '18:00' },
    ],
  },
  {
    key: 'fri',
    label: 'VIE',
    enabled: true,
    ranges: [
      { start: '09:00', end: '12:00' },
      { start: '14:00', end: '18:00' },
    ],
  },
  {
    key: 'sat',
    label: 'SÁB',
    enabled: false,
    ranges: [
      { start: '09:00', end: '12:00' },
      { start: '14:00', end: '18:00' },
    ],
  },
  {
    key: 'sun',
    label: 'DOM',
    enabled: false,
    ranges: [
      { start: '09:00', end: '12:00' },
      { start: '14:00', end: '18:00' },
    ],
  },
];
