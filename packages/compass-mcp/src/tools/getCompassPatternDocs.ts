import { readFileSync } from 'fs';
import { join, basename } from 'path';
import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { analyticsToolCallEventName, PATTERNS_KNOWLEDGEBASE_DIRECTORY } from '../utils/tokens.js';

import { getCompassDocsList } from '../utils/generalUtils.js';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import { getCompassDocsResponseText } from '../utils/getCompassDocsResponseText.js';
import { shouldCreateOrUpdateSkill } from '../utils/skillUtils.js';
import type { McpToolResponse } from '../utils/types.js';
import {
  commonCompassMCPToolSchema,
  httpTransportSkillVersionSchema,
} from '../utils/getCommonSchema.js';
import { getCompassComponentDocsToolName } from './getCompassComponentDocs.js';

const compassPatternsList = getCompassDocsList('patterns');
const whichPatternToUseGuide = readFileSync(
  join(PATTERNS_KNOWLEDGEBASE_DIRECTORY, 'index.md'),
  'utf8',
);

const getCompassPatternDocsToolName = 'get_compass_pattern_docs';

const getCompassPatternDocsToolDescription = `Fetch the Compass Design System pattern docs. Use this to get information about design patterns, best practices, and implementation guidelines.`;

// Schema for stdio transport
const getCompassPatternDocsStdioSchema = {
  patternsList: z
    .string()
    .describe(
      `Comma separated list of Compass pattern names. E.g. "ListView, DetailedView". Possible values: ${compassPatternsList.join(
        ', ',
      )}. Here is guide on how to decide which pattern to use: ${whichPatternToUseGuide}`,
    ),
  ...commonCompassMCPToolSchema,
};

// Schema for HTTP transport
const getCompassPatternDocsHttpSchema = {
  ...getCompassPatternDocsStdioSchema,
  ...httpTransportSkillVersionSchema,
};

// Core business logic function
const getCompassPatternDocsCore = ({
  patternsList,
  currentProjectRootDirectory,
  skipLocalSkillChecks = false,
  skillVersion,
  clientName,
}: {
  patternsList: string;
  currentProjectRootDirectory?: string;
  skipLocalSkillChecks?: boolean;
  skillVersion?: string;
  clientName: 'claude' | 'cursor' | 'unknown';
}): McpToolResponse => {
  const components = patternsList.split(',').map((s) => s.trim());
  const invalidComponents = components.filter((comp) => !compassPatternsList.includes(comp));
  if (invalidComponents.length > 0) {
    return handleError({
      toolName: getCompassPatternDocsToolName,
      mcpErrorMessage: `Invalid argument componentsList. Invalid values: ${invalidComponents.join(
        ', ',
      )}. Valid component docs values: ${compassPatternsList.join(
        ', ',
      )}. Make sure to call the parent component name (e.g. instead of calling ListViewFilters, call ListView)`,
    });
  }

  // Check skill using shouldCreateOrUpdateSkill which handles both file system and version checks
  if (currentProjectRootDirectory) {
    const createOrUpdateSkill = shouldCreateOrUpdateSkill(
      skillVersion,
      currentProjectRootDirectory,
      skipLocalSkillChecks,
      getCompassPatternDocsToolName,
    );
    if (createOrUpdateSkill) {
      return createOrUpdateSkill;
    }
  }

  try {
    const responseText = getCompassDocsResponseText({
      docsList: patternsList,
      documentationType: 'patterns',
    });

    // Return the formatted response
    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: getCompassPatternDocsToolName,
        patternsList,
        rootDirectoryName: currentProjectRootDirectory
          ? basename(currentProjectRootDirectory)
          : undefined,
        skillVersion,
        clientName,
      },
    });

    return {
      content: [
        {
          type: 'text',
          text: `Below is the documentation for Patterns. After this, call ${getCompassComponentDocsToolName} to get documentation for components that are used in patterns.:\n ${responseText}`,
        },
      ],
    };
  } catch (error: unknown) {
    return handleError({
      toolName: getCompassPatternDocsToolName,
      errorObject: error,
    });
  }
};

// Callback for stdio transport
const getCompassPatternDocsStdioCallback: ToolCallback<typeof getCompassPatternDocsStdioSchema> = ({
  patternsList,
  currentProjectRootDirectory,
  clientName,
}) => {
  return getCompassPatternDocsCore({
    patternsList,
    currentProjectRootDirectory,
    skipLocalSkillChecks: false, // Perform skill checks for stdio
    clientName,
  });
};

// Callback for HTTP transport
const getCompassPatternDocsHttpCallback: ToolCallback<typeof getCompassPatternDocsHttpSchema> = ({
  patternsList,
  skillVersion,
  clientName,
  currentProjectRootDirectory,
}) => {
  return getCompassPatternDocsCore({
    patternsList,
    currentProjectRootDirectory,
    skipLocalSkillChecks: true, // Skip local skill checks for HTTP
    skillVersion,
    clientName,
  });
};

export {
  getCompassPatternDocsToolName,
  getCompassPatternDocsToolDescription,
  getCompassPatternDocsStdioCallback,
  getCompassPatternDocsHttpCallback,
  getCompassPatternDocsStdioSchema,
  getCompassPatternDocsHttpSchema,
};
