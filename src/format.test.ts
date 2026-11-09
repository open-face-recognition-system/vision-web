import { formatDate, toDateOnly } from './format';

describe('dates without time', () => {
  it('shows the stored calendar day, not the day shifted to the local time zone', () => {
    expect(formatDate('2026-01-01T00:00:00.000Z')).toBe('01/01/2026');
  });

  it('sends the picked calendar day without a time zone', () => {
    expect(toDateOnly(new Date(2026, 0, 1))).toBe('2026-01-01');
  });
});
