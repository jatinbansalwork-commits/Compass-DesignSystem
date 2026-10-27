import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createCompassSkillHttpCallback,
  createCompassSkillStdioCallback,
} from '../createCompassSkill.js';
import * as analyticsUtils from '../../utils/analyticsUtils.js';
import * as skillUtils from '../../utils/skillUtils.js';
import { SKILL_VERSION_STRING } from '../../utils/tokens.js';

vi.mock('../../utils/analyticsUtils.js');
vi.mock('../../utils/skillUtils.js');

const createMockContext = (): any => ({
  signal: new AbortController().signal,
  requestId: 'test-request-id',
  sendNotification: vi.fn().mockResolvedValue(undefined),
  sendRequest: vi.fn().mockResolvedValue({}),
});

describe('createCompassSkill HTTP callback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return skill creation instructions', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/project';
    const mockInstructions = 'Mock instructions for creating compass skill';

    vi.spyOn(skillUtils, 'skillCreationInstructions').mockReturnValue(mockInstructions);

    const result = createCompassSkillHttpCallback(
      { currentProjectRootDirectory: mockCurrentProjectRootDirectory },
      createMockContext(),
    );

    expect(analyticsUtils.sendAnalytics).toHaveBeenCalledWith({
      eventName: expect.any(String),
      properties: {
        toolName: 'create_compass_skill',
        skillVersion: expect.any(String),
        rootDirectoryName: expect.any(String),
      },
    });
    expect(result).toMatchObject({
      content: [{ type: 'text', text: mockInstructions }],
    });
    expect(skillUtils.skillCreationInstructions).toHaveBeenCalledWith({
      currentProjectRootDirectory: mockCurrentProjectRootDirectory,
    });
  });
});

describe('createCompassSkill stdio callback', () => {
  let tmpDir: string;

  beforeEach(() => {
    vi.clearAllMocks();
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'compass-skill-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true });
  });

  it('should create skill file and symlink in the correct locations', () => {
    vi.mocked(analyticsUtils.sendAnalytics).mockImplementation(() => undefined);

    const result = createCompassSkillStdioCallback(
      { currentProjectRootDirectory: tmpDir },
      createMockContext(),
    );

    const skillFilePath = path.join(tmpDir, '.agents/skills/ui-code-guidelines/SKILL.md');
    const symlinkPath = path.join(tmpDir, '.claude/skills/ui-code-guidelines');

    expect(result).toMatchObject({
      content: [{ type: 'text', text: expect.stringContaining('Compass skill created') }],
    });
    expect(fs.existsSync(skillFilePath)).toBe(true);
    expect(fs.existsSync(symlinkPath)).toBe(true);
  });

  it('should write template content that passes the version check (regression: quote mismatch)', () => {
    vi.mocked(analyticsUtils.sendAnalytics).mockImplementation(() => undefined);

    createCompassSkillStdioCallback({ currentProjectRootDirectory: tmpDir }, createMockContext());

    const skillFilePath = path.join(tmpDir, '.agents/skills/ui-code-guidelines/SKILL.md');
    const writtenContent = fs.readFileSync(skillFilePath, 'utf8');

    // If this fails, the template and SKILL_VERSION_STRING are out of sync
    expect(writtenContent).toContain(SKILL_VERSION_STRING);
  });

  it('should return "already up to date" if skill file is current', () => {
    vi.mocked(analyticsUtils.sendAnalytics).mockImplementation(() => undefined);

    // Create it once
    createCompassSkillStdioCallback({ currentProjectRootDirectory: tmpDir }, createMockContext());
    // Try again
    const result = createCompassSkillStdioCallback(
      { currentProjectRootDirectory: tmpDir },
      createMockContext(),
    );

    expect(result).toMatchObject({
      content: [{ type: 'text', text: expect.stringContaining('up to date') }],
    });
  });
});
