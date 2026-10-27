import { announce, clearAnnouncer, destroyAnnouncer } from '../LiveAnnouncer.web';

describe('LiveAnnouncer', () => {
  afterEach(() => {
    destroyAnnouncer();
  });

  it('inserts assertive live region content for screen readers', () => {
    announce('Payment succeeded');
    const region = document.querySelector('[data-live-announcer="true"] [aria-live="assertive"]');
    expect(region?.textContent).toContain('Payment succeeded');
  });

  it('clears queued announcements', () => {
    announce('First');
    clearAnnouncer('assertive');
    const region = document.querySelector('[data-live-announcer="true"] [aria-live="assertive"]');
    expect(region?.textContent).toBe('');
  });
});
