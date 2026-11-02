import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Sync test — verifies that packages/kdesign/src/utils/cardTicketOutline.ts and
 * packages/kdesign-core/src/utils/cardTicketOutline.ts stay in sync.
 *
 * kdesign cannot depend on kdesign-core yet, so the file is duplicated. This test
 * compares the functional code (excluding the sync-comment header) to catch drift.
 */
describe('cardTicketOutline sync', () => {
  const kdesignCorePath = resolve(__dirname, 'cardTicketOutline.ts');
  const kdesignPath = resolve(__dirname, '../../../kdesign/src/utils/cardTicketOutline.ts');

  const stripSyncHeader = (content: string): string => {
    const lines = content.split('\n');
    const firstExportIndex = lines.findIndex((line) => line.startsWith('/** Corner radius'));
    return lines.slice(firstExportIndex).join('\n');
  };

  it('kdesign and kdesign-core cardTicketOutline.ts should have identical functional code', () => {
    const kdesignCoreContent = readFileSync(kdesignCorePath, 'utf-8');
    const kdesignContent = readFileSync(kdesignPath, 'utf-8');

    const kdesignCoreCode = stripSyncHeader(kdesignCoreContent);
    const kdesignCode = stripSyncHeader(kdesignContent);

    expect(kdesignCoreCode).toBe(kdesignCode);
  });
});
