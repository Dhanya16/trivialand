import { sanitizePlainText } from '../../src/common/utils/sanitize.util';

describe('sanitizePlainText', () => {
  it('strips HTML tags and trims whitespace', () => {
    expect(sanitizePlainText('  <b>Hello</b> world  ')).toBe('Hello world');
  });

  it('removes javascript protocol patterns', () => {
    expect(sanitizePlainText('javascript:alert(1)')).toBe('alert(1)');
  });
});
