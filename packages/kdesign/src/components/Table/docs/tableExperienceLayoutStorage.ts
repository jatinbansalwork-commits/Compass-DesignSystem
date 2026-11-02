type TableExperienceLayoutPrefs = {
  columnOrder: string[];
  visibleColumnKeys: string[];
  columnWidths: Record<string, number>;
};

const readTableExperienceLayoutPrefs = (
  storageKey: string,
): TableExperienceLayoutPrefs | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as TableExperienceLayoutPrefs;
  } catch {
    return null;
  }
};

const writeTableExperienceLayoutPrefs = (
  storageKey: string,
  prefs: TableExperienceLayoutPrefs,
): void => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(storageKey, JSON.stringify(prefs));
};

const clearTableExperienceLayoutPrefs = (storageKey: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(storageKey);
};

export type { TableExperienceLayoutPrefs };
export {
  readTableExperienceLayoutPrefs,
  writeTableExperienceLayoutPrefs,
  clearTableExperienceLayoutPrefs,
};
