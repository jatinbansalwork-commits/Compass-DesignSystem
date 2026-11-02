import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getKdesignGeneralDocsHttpCallback } from '../getKdesignGeneralDocs.js';
import * as analyticsUtils from '../../utils/analyticsUtils.js';
import * as skillUtils from '../../utils/skillUtils.js';
import * as getKdesignDocsResponseText from '../../utils/getKdesignDocsResponseText.js';
import * as generalUtils from '../../utils/generalUtils.js';
import { SKILL_VERSION } from '../../utils/tokens.js';

// Mock the analytics and utility functions
vi.mock('../../utils/analyticsUtils.js', async () => {
  const actual = await vi.importActual<typeof analyticsUtils>('../../utils/analyticsUtils.js');
  return {
    ...actual,
    sendAnalytics: vi.fn(),
  };
});
vi.mock('../../utils/skillUtils.js');
vi.mock('../../utils/getKdesignDocsResponseText.js');
vi.mock('../../utils/generalUtils.js', () => ({
  getKdesignDocsList: vi.fn(() => ['AvailableIcons', 'ChartColorSystem', 'Usage', 'WhiteLabelling']),
}));
vi.mock('fs', () => ({
  readFileSync: vi.fn(() => 'Mock guide content'),
  existsSync: vi.fn(() => false),
}));

// Create a mock context object for tool callbacks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockContext = (): any => ({
  signal: new AbortController().signal,
  requestId: 'test-request-id',
  sendNotification: vi.fn().mockResolvedValue(undefined),
  sendRequest: vi.fn().mockResolvedValue({}),
});

describe('getKdesignGeneralDocs Tool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default mocks
    vi.spyOn(generalUtils, 'getKdesignDocsList').mockReturnValue([
      'AvailableIcons',
      'ChartColorSystem',
      'Usage',
      'WhiteLabelling',
    ]);
    vi.spyOn(skillUtils, 'shouldCreateOrUpdateSkill').mockReturnValue(undefined);
  });

  it('should return general docs for valid topics', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/project';
    const mockTopicsList = 'Usage, AvailableIcons';
    const mockResponseText = 'Mock general documentation';

    // Mock the getKdesignDocsResponseText function
    vi.spyOn(getKdesignDocsResponseText, 'getKdesignDocsResponseText').mockReturnValue(
      mockResponseText,
    );

    // Get the HTTP callback
    const httpCallback = getKdesignGeneralDocsHttpCallback;

    // Call the tool callback
    const result = httpCallback(
      {
        topicsList: mockTopicsList,
        currentProjectRootDirectory: mockCurrentProjectRootDirectory,
        clientName: 'cursor',
        skillVersion: SKILL_VERSION,
      },
      createMockContext(),
    );

    // Verify analytics was called
    expect(analyticsUtils.sendAnalytics).toHaveBeenCalledWith({
      eventName: expect.any(String),
      properties: {
        toolName: 'get_kdesign_general_docs',
        topicsList: mockTopicsList,
        rootDirectoryName: 'project',
        skillVersion: SKILL_VERSION,
        clientName: 'cursor',
      },
    });

    // Verify the result structure
    expect(result).toHaveProperty('content');
    if ('content' in result && !('isError' in result)) {
      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toHaveProperty('type', 'text');
      if ('text' in result.content[0]) {
        expect(result.content[0].text).toBe(mockResponseText.trim());
      }
    }

    // Verify getKdesignDocsResponseText was called with correct parameters
    expect(getKdesignDocsResponseText.getKdesignDocsResponseText).toHaveBeenCalledWith({
      docsList: mockTopicsList,
      documentationType: 'general',
    });
  });

  it('should return error for invalid topics', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/project';
    const mockTopicsList = 'InvalidTopic, AnotherInvalid';

    // Get the HTTP callback
    const httpCallback = getKdesignGeneralDocsHttpCallback;

    // Call the tool callback
    const result = httpCallback(
      {
        topicsList: mockTopicsList,
        currentProjectRootDirectory: mockCurrentProjectRootDirectory,
        clientName: 'cursor',
        skillVersion: SKILL_VERSION,
      },
      createMockContext(),
    );

    // Verify the result is an error
    expect(result).toBeDefined();
    expect(result).toHaveProperty('isError', true);
    if ('isError' in result && result.isError) {
      expect(result).toMatchObject({
        content: [
          {
            type: 'text',
            text: expect.any(String),
          },
        ],
      });
    }

    // Verify analytics was not called for invalid topics
    expect(analyticsUtils.sendAnalytics).not.toHaveBeenCalled();
  });

  it('should return consistent general docs response (snapshot)', async () => {
    const testProjectRootDirectory = '/Users/test/project';
    const testTopicsList = 'Usage, AvailableIcons';

    // Unmock fs first so that getKdesignDocsResponseText can read real files
    vi.doUnmock('fs');

    // Get the actual implementations (not mocked) to test real output
    // Re-import getKdesignDocsResponseText after unmocking fs so it uses actual readFileSync
    vi.doUnmock('../../utils/getKdesignDocsResponseText.js');
    const actualGetKdesignDocsResponseText = await vi.importActual<typeof getKdesignDocsResponseText>(
      '../../utils/getKdesignDocsResponseText.js',
    );
    const actualGeneralUtils = await vi.importActual<typeof generalUtils>(
      '../../utils/generalUtils.js',
    );

    // Unmock analytics to allow the actual function to run, but we'll still spy on it
    vi.restoreAllMocks();
    vi.spyOn(analyticsUtils, 'sendAnalytics').mockImplementation(() => {
      // Mock implementation that doesn't throw
    });

    if (actualGetKdesignDocsResponseText && actualGeneralUtils) {
      // Temporarily replace the mocked functions with the actual ones
      vi.spyOn(getKdesignDocsResponseText, 'getKdesignDocsResponseText').mockImplementation(
        actualGetKdesignDocsResponseText.getKdesignDocsResponseText,
      );
      vi.spyOn(generalUtils, 'getKdesignDocsList').mockImplementation(
        actualGeneralUtils.getKdesignDocsList,
      );
    }

    // Mock skill as not needing update
    vi.spyOn(skillUtils, 'shouldCreateOrUpdateSkill').mockReturnValue(undefined);

    // Get the HTTP callback
    const httpCallback = getKdesignGeneralDocsHttpCallback;

    // Call the tool callback with actual implementation
    const result = httpCallback(
      {
        topicsList: testTopicsList,
        currentProjectRootDirectory: testProjectRootDirectory,
        clientName: 'cursor',
        skillVersion: SKILL_VERSION,
      },
      createMockContext(),
    );

    // Snapshot test to ensure the output format remains consistent
    expect(result).toMatchSnapshot();
  });

  it('should return consistent general docs response for claude agent', async () => {
    const testProjectRootDirectory = '/Users/test/project';
    const testTopicsList = 'Usage, AvailableIcons';

    // Unmock fs first so that getKdesignDocsResponseText can read real files
    vi.doUnmock('fs');

    // Get the actual implementations (not mocked) to test real output
    // Re-import getKdesignDocsResponseText after unmocking fs so it uses actual readFileSync
    vi.doUnmock('../../utils/getKdesignDocsResponseText.js');
    const actualGetKdesignDocsResponseText = await vi.importActual<typeof getKdesignDocsResponseText>(
      '../../utils/getKdesignDocsResponseText.js',
    );
    const actualGeneralUtils = await vi.importActual<typeof generalUtils>(
      '../../utils/generalUtils.js',
    );

    // Unmock analytics to allow the actual function to run, but we'll still spy on it
    vi.restoreAllMocks();
    vi.spyOn(analyticsUtils, 'sendAnalytics').mockImplementation(() => {
      // Mock implementation that doesn't throw
    });

    if (actualGetKdesignDocsResponseText && actualGeneralUtils) {
      // Temporarily replace the mocked functions with the actual ones
      vi.spyOn(getKdesignDocsResponseText, 'getKdesignDocsResponseText').mockImplementation(
        actualGetKdesignDocsResponseText.getKdesignDocsResponseText,
      );
      vi.spyOn(generalUtils, 'getKdesignDocsList').mockImplementation(
        actualGeneralUtils.getKdesignDocsList,
      );
    }

    // Mock skill as not needing update
    vi.spyOn(skillUtils, 'shouldCreateOrUpdateSkill').mockReturnValue(undefined);

    // Get the HTTP callback
    const httpCallback = getKdesignGeneralDocsHttpCallback;

    // Call the tool callback with actual implementation
    const result = httpCallback(
      {
        topicsList: testTopicsList,
        currentProjectRootDirectory: testProjectRootDirectory,
        clientName: 'claude',
        skillVersion: SKILL_VERSION,
      },
      createMockContext(),
    );

    // Snapshot test to ensure the output format remains consistent
    expect(result).toMatchSnapshot();
  });
});
