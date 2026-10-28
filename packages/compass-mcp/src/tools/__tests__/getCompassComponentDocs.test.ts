import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getCompassComponentDocsHttpCallback,
  getCompassComponentDocsStdioCallback,
} from '../getCompassComponentDocs.js';
import * as analyticsUtils from '../../utils/analyticsUtils.js';
import * as skillUtils from '../../utils/skillUtils.js';
import * as getCompassDocsResponseText from '../../utils/getCompassDocsResponseText.js';
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
vi.mock('../../utils/getCompassDocsResponseText.js');
vi.mock('../../utils/generalUtils.js', () => ({
  getCompassDocsList: vi.fn(() => ['Button', 'Accordion', 'Input']),
}));

// Create a mock context object for tool callbacks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockContext = (): any => ({
  signal: new AbortController().signal,
  requestId: 'test-request-id',
  sendNotification: vi.fn().mockResolvedValue(undefined),
  sendRequest: vi.fn().mockResolvedValue({}),
});

describe('getCompassComponentDocs Tool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default mocks
    vi.spyOn(generalUtils, 'getCompassDocsList').mockReturnValue(['Button', 'Accordion', 'Input']);
    vi.spyOn(skillUtils, 'shouldCreateOrUpdateSkill').mockReturnValue(undefined);
  });

  it('should return component docs for valid components', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/project';
    const mockComponentsList = 'Button, Accordion';
    const mockResponseText = 'Mock component documentation';

    // Mock the getCompassDocsResponseText function
    vi.spyOn(getCompassDocsResponseText, 'getCompassDocsResponseText').mockReturnValue(
      mockResponseText,
    );

    // Get the HTTP callback
    const httpCallback = getCompassComponentDocsHttpCallback;

    // Call the tool callback
    const result = httpCallback(
      {
        componentsList: mockComponentsList,
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
        toolName: 'get_compass_component_docs',
        componentsList: mockComponentsList,
        rootDirectoryName: 'project',
        skillVersion: SKILL_VERSION,
        clientName: 'cursor',
      },
    });

    // Verify the result structure
    expect(result).toHaveProperty('content');
    if ('content' in result && !('isError' in result)) {
      expect(result).toMatchObject({
        content: [
          {
            type: 'text',
            text: mockResponseText.trim(),
          },
        ],
      });
    }

    // Verify getCompassDocsResponseText was called with correct parameters
    expect(getCompassDocsResponseText.getCompassDocsResponseText).toHaveBeenCalledWith({
      docsList: mockComponentsList,
      documentationType: 'components',
    });
  });

  it('should return error for invalid components', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/project';
    const mockComponentsList = 'InvalidComponent, AnotherInvalid';

    // Get the HTTP callback
    const httpCallback = getCompassComponentDocsHttpCallback;

    // Call the tool callback
    const result = httpCallback(
      {
        componentsList: mockComponentsList,
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

    // Verify analytics was not called for invalid components
    expect(analyticsUtils.sendAnalytics).not.toHaveBeenCalled();
  });

  it('should return consistent component docs response (snapshot)', async () => {
    const testProjectRootDirectory = '/Users/test/project';
    const testComponentsList = 'Button, Accordion';

    // Get the actual implementations (not mocked) to test real output
    const actualGetCompassDocsResponseText = await vi.importActual<typeof getCompassDocsResponseText>(
      '../../utils/getCompassDocsResponseText.js',
    );
    const actualGeneralUtils = await vi.importActual<typeof generalUtils>(
      '../../utils/generalUtils.js',
    );

    // Unmock analytics to allow the actual function to run, but we'll still spy on it
    vi.restoreAllMocks();
    vi.spyOn(analyticsUtils, 'sendAnalytics').mockImplementation(() => {
      // Mock implementation that doesn't throw
    });

    if (actualGetCompassDocsResponseText && actualGeneralUtils) {
      // Temporarily replace the mocked functions with the actual ones
      vi.spyOn(getCompassDocsResponseText, 'getCompassDocsResponseText').mockImplementation(
        actualGetCompassDocsResponseText.getCompassDocsResponseText,
      );
      vi.spyOn(generalUtils, 'getCompassDocsList').mockImplementation(
        actualGeneralUtils.getCompassDocsList,
      );
    }

    // Mock skill as not needing update
    vi.spyOn(skillUtils, 'shouldCreateOrUpdateSkill').mockReturnValue(undefined);

    // Get the HTTP callback
    const httpCallback = getCompassComponentDocsHttpCallback;

    // Call the tool callback with actual implementation
    const result = httpCallback(
      {
        componentsList: testComponentsList,
        currentProjectRootDirectory: testProjectRootDirectory,
        clientName: 'cursor',
        skillVersion: SKILL_VERSION,
      },
      createMockContext(),
    );

    // Snapshot test to ensure the output format remains consistent
    expect(result).toMatchSnapshot();
  });

  it('should return consistent component docs response for claude agent (snapshot)', async () => {
    const testProjectRootDirectory = '/Users/test/project';
    const testComponentsList = 'Button, Accordion';

    // Get the actual implementations (not mocked) to test real output
    const actualGetCompassDocsResponseText = await vi.importActual<typeof getCompassDocsResponseText>(
      '../../utils/getCompassDocsResponseText.js',
    );
    const actualGeneralUtils = await vi.importActual<typeof generalUtils>(
      '../../utils/generalUtils.js',
    );

    // Unmock analytics to allow the actual function to run, but we'll still spy on it
    vi.restoreAllMocks();
    vi.spyOn(analyticsUtils, 'sendAnalytics').mockImplementation(() => {
      // Mock implementation that doesn't throw
    });

    if (actualGetCompassDocsResponseText && actualGeneralUtils) {
      // Temporarily replace the mocked functions with the actual ones
      vi.spyOn(getCompassDocsResponseText, 'getCompassDocsResponseText').mockImplementation(
        actualGetCompassDocsResponseText.getCompassDocsResponseText,
      );
      vi.spyOn(generalUtils, 'getCompassDocsList').mockImplementation(
        actualGeneralUtils.getCompassDocsList,
      );
    }

    // Mock skill as not needing update
    vi.spyOn(skillUtils, 'shouldCreateOrUpdateSkill').mockReturnValue(undefined);

    // Get the HTTP callback
    const httpCallback = getCompassComponentDocsHttpCallback;

    // Call the tool callback with actual implementation
    const result = httpCallback(
      {
        componentsList: testComponentsList,
        currentProjectRootDirectory: testProjectRootDirectory,
        clientName: 'claude',
        skillVersion: SKILL_VERSION,
      },
      createMockContext(),
    );

    // Snapshot test to ensure the output format remains consistent
    expect(result).toMatchSnapshot();
  });

  it('should return consistent component docs response for stdio transport', async () => {
    const testProjectRootDirectory = '/Users/test/project';
    const testComponentsList = 'Button, Accordion';

    // Get the actual implementations (not mocked) to test real output
    const actualGetCompassDocsResponseText = await vi.importActual<typeof getCompassDocsResponseText>(
      '../../utils/getCompassDocsResponseText.js',
    );
    const actualGeneralUtils = await vi.importActual<typeof generalUtils>(
      '../../utils/generalUtils.js',
    );

    // Unmock analytics to allow the actual function to run, but we'll still spy on it
    vi.restoreAllMocks();
    vi.spyOn(analyticsUtils, 'sendAnalytics').mockImplementation(() => {
      // Mock implementation that doesn't throw
    });

    if (actualGetCompassDocsResponseText && actualGeneralUtils) {
      // Temporarily replace the mocked functions with the actual ones
      vi.spyOn(getCompassDocsResponseText, 'getCompassDocsResponseText').mockImplementation(
        actualGetCompassDocsResponseText.getCompassDocsResponseText,
      );
      vi.spyOn(generalUtils, 'getCompassDocsList').mockImplementation(
        actualGeneralUtils.getCompassDocsList,
      );
    }

    // Mock skill as not needing update
    vi.spyOn(skillUtils, 'shouldCreateOrUpdateSkill').mockReturnValue(undefined);

    // Get the stdio callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stdioCallback = getCompassComponentDocsStdioCallback;

    // Call the tool callback with actual implementation
    const result = stdioCallback(
      {
        componentsList: testComponentsList,
        currentProjectRootDirectory: testProjectRootDirectory,
        clientName: 'cursor',
      },
      createMockContext(),
    );

    // Snapshot test to ensure the output format remains consistent
    expect(result).toMatchSnapshot();
  });
});
