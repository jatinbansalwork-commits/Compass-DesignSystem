import { readFileSync } from 'fs';
import { join, basename } from 'path';
import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { analyticsToolCallEventName, GENERAL_KNOWLEDGEBASE_DIRECTORY } from '../utils/tokens.js';
import {
  commonCompassMCPToolSchema,
  httpTransportSkillVersionSchema,
} from '../utils/getCommonSchema.js';

import { getCompassDocsList } from '../utils/generalUtils.js';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import { getCompassDocsResponseText } from '../utils/getCompassDocsResponseText.js';
import { shouldCreateOrUpdateSkill } from '../utils/skillUtils.js';
import type { McpToolResponse } from '../utils/types.js';

const compassGeneralDocsList = getCompassDocsList('general');

const getCompassGeneralDocsToolName = 'get_compass_general_docs';

const whichGeneralDocsToUse = readFileSync(
  join(GENERAL_KNOWLEDGEBASE_DIRECTORY, 'index.md'),
  'utf8',
);

const getCompassGeneralDocsToolDescription = `Fetch general Compass Design System documentation. Use this to get information about setup, installation, theming, tokens, and general guidelines.`;

// Schema for stdio transport
const getCompassGeneralDocsStdioSchema = {
  topicsList: z
    .string()
    .describe(
      `Comma separated list of general documentation topics. E.g. "Installation, Theming". Possible values: ${compassGeneralDocsList.join(
        ', ',
      )}. Here is guide on how to decide which general docs you might need:\n ${whichGeneralDocsToUse}`,
    ),
  ...commonCompassMCPToolSchema,
};

// Schema for HTTP transport
const getCompassGeneralDocsHttpSchema = {
  ...getCompassGeneralDocsStdioSchema,
  ...httpTransportSkillVersionSchema,
};

// Core business logic function
const getCompassGeneralDocsCore = ({
  topicsList,
  currentProjectRootDirectory,
  skipLocalSkillChecks = false,
  skillVersion = '0',
  clientName,
}: {
  topicsList: string;
  currentProjectRootDirectory?: string;
  skipLocalSkillChecks?: boolean;
  skillVersion?: string;
  clientName: 'claude' | 'cursor' | 'unknown';
}): McpToolResponse => {
  const topics = topicsList.split(',').map((s) => s.trim());
  const invalidTopics = topics.filter((topic) => !compassGeneralDocsList.includes(topic));
  if (invalidTopics.length > 0) {
    return handleError({
      toolName: getCompassGeneralDocsToolName,
      mcpErrorMessage: `Invalid argument topicsList. Invalid values: ${invalidTopics.join(
        ', ',
      )}. Valid general docs values: ${compassGeneralDocsList.join(', ')}`,
    });
  }

  // Check skill using shouldCreateOrUpdateSkill which handles both file system and version checks
  if (currentProjectRootDirectory) {
    const createOrUpdateSkill = shouldCreateOrUpdateSkill(
      skillVersion,
      currentProjectRootDirectory,
      skipLocalSkillChecks,
      getCompassGeneralDocsToolName,
    );
    if (createOrUpdateSkill) {
      return createOrUpdateSkill;
    }
  }

  try {
    const responseText = getCompassDocsResponseText({
      docsList: topicsList,
      documentationType: 'general',
    });

    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: getCompassGeneralDocsToolName,
        topicsList,
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
          text: responseText.trim(),
        },
      ],
    };
  } catch (error: unknown) {
    return handleError({
      toolName: getCompassGeneralDocsToolName,
      errorObject: error,
    });
  }
};

// Callback for stdio transport
const getCompassGeneralDocsStdioCallback: ToolCallback<typeof getCompassGeneralDocsStdioSchema> = ({
  topicsList,
  currentProjectRootDirectory,
  clientName,
}) => {
  return getCompassGeneralDocsCore({
    topicsList,
    currentProjectRootDirectory,
    skipLocalSkillChecks: false, // Perform skill checks for stdio
    clientName,
  });
};

// Callback for HTTP transport
const getCompassGeneralDocsHttpCallback: ToolCallback<typeof getCompassGeneralDocsHttpSchema> = ({
  topicsList,
  skillVersion,
  clientName,
  currentProjectRootDirectory,
}) => {
  return getCompassGeneralDocsCore({
    topicsList,
    currentProjectRootDirectory,
    skipLocalSkillChecks: true, // Skip local skill checks for HTTP
    skillVersion,
    clientName,
  });
};

export {
  getCompassGeneralDocsToolName,
  getCompassGeneralDocsToolDescription,
  getCompassGeneralDocsHttpCallback,
  getCompassGeneralDocsStdioCallback,
  getCompassGeneralDocsHttpSchema,
  getCompassGeneralDocsStdioSchema,
};
