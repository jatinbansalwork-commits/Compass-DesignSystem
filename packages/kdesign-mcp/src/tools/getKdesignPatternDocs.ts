import { readFileSync } from 'fs';
import { join, basename } from 'path';
import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { analyticsToolCallEventName, PATTERNS_KNOWLEDGEBASE_DIRECTORY } from '../utils/tokens.js';

import { getKdesignDocsList } from '../utils/generalUtils.js';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import { getKdesignDocsResponseText } from '../utils/getKdesignDocsResponseText.js';
import { shouldCreateOrUpdateSkill } from '../utils/skillUtils.js';
import type { McpToolResponse } from '../utils/types.js';
import {
  commonKdesignMCPToolSchema,
  httpTransportSkillVersionSchema,
} from '../utils/getCommonSchema.js';
import { getKdesignComponentDocsToolName } from './getKdesignComponentDocs.js';

const kdesignPatternsList = getKdesignDocsList('patterns');
const whichPatternToUseGuide = readFileSync(
  join(PATTERNS_KNOWLEDGEBASE_DIRECTORY, 'index.md'),
  'utf8',
);

const getKdesignPatternDocsToolName = 'get_kdesign_pattern_docs';

const getKdesignPatternDocsToolDescription = `Fetch the Kdesign Design System pattern docs. Use this to get information about design patterns, best practices, and implementation guidelines.`;

// Schema for stdio transport
const getKdesignPatternDocsStdioSchema = {
  patternsList: z
    .string()
    .describe(
      `Comma separated list of Kdesign pattern names. E.g. "ListView, DetailedView". Possible values: ${kdesignPatternsList.join(
        ', ',
      )}. Here is guide on how to decide which pattern to use: ${whichPatternToUseGuide}`,
    ),
  ...commonKdesignMCPToolSchema,
};

// Schema for HTTP transport
const getKdesignPatternDocsHttpSchema = {
  ...getKdesignPatternDocsStdioSchema,
  ...httpTransportSkillVersionSchema,
};

// Core business logic function
const getKdesignPatternDocsCore = ({
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
  const invalidComponents = components.filter((comp) => !kdesignPatternsList.includes(comp));
  if (invalidComponents.length > 0) {
    return handleError({
      toolName: getKdesignPatternDocsToolName,
      mcpErrorMessage: `Invalid argument componentsList. Invalid values: ${invalidComponents.join(
        ', ',
      )}. Valid component docs values: ${kdesignPatternsList.join(
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
      getKdesignPatternDocsToolName,
    );
    if (createOrUpdateSkill) {
      return createOrUpdateSkill;
    }
  }

  try {
    const responseText = getKdesignDocsResponseText({
      docsList: patternsList,
      documentationType: 'patterns',
    });

    // Return the formatted response
    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: getKdesignPatternDocsToolName,
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
          text: `Below is the documentation for Patterns. After this, call ${getKdesignComponentDocsToolName} to get documentation for components that are used in patterns.:\n ${responseText}`,
        },
      ],
    };
  } catch (error: unknown) {
    return handleError({
      toolName: getKdesignPatternDocsToolName,
      errorObject: error,
    });
  }
};

// Callback for stdio transport
const getKdesignPatternDocsStdioCallback: ToolCallback<typeof getKdesignPatternDocsStdioSchema> = ({
  patternsList,
  currentProjectRootDirectory,
  clientName,
}) => {
  return getKdesignPatternDocsCore({
    patternsList,
    currentProjectRootDirectory,
    skipLocalSkillChecks: false, // Perform skill checks for stdio
    clientName,
  });
};

// Callback for HTTP transport
const getKdesignPatternDocsHttpCallback: ToolCallback<typeof getKdesignPatternDocsHttpSchema> = ({
  patternsList,
  skillVersion,
  clientName,
  currentProjectRootDirectory,
}) => {
  return getKdesignPatternDocsCore({
    patternsList,
    currentProjectRootDirectory,
    skipLocalSkillChecks: true, // Skip local skill checks for HTTP
    skillVersion,
    clientName,
  });
};

export {
  getKdesignPatternDocsToolName,
  getKdesignPatternDocsToolDescription,
  getKdesignPatternDocsStdioCallback,
  getKdesignPatternDocsHttpCallback,
  getKdesignPatternDocsStdioSchema,
  getKdesignPatternDocsHttpSchema,
};
