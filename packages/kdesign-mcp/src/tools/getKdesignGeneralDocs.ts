import { readFileSync } from 'fs';
import { join, basename } from 'path';
import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { analyticsToolCallEventName, GENERAL_KNOWLEDGEBASE_DIRECTORY } from '../utils/tokens.js';
import {
  commonKdesignMCPToolSchema,
  httpTransportSkillVersionSchema,
} from '../utils/getCommonSchema.js';

import { getKdesignDocsList } from '../utils/generalUtils.js';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import { getKdesignDocsResponseText } from '../utils/getKdesignDocsResponseText.js';
import { shouldCreateOrUpdateSkill } from '../utils/skillUtils.js';
import type { McpToolResponse } from '../utils/types.js';

const kdesignGeneralDocsList = getKdesignDocsList('general');

const getKdesignGeneralDocsToolName = 'get_kdesign_general_docs';

const whichGeneralDocsToUse = readFileSync(
  join(GENERAL_KNOWLEDGEBASE_DIRECTORY, 'index.md'),
  'utf8',
);

const getKdesignGeneralDocsToolDescription = `Fetch general Kdesign Design System documentation. Use this to get information about setup, installation, theming, tokens, and general guidelines.`;

// Schema for stdio transport
const getKdesignGeneralDocsStdioSchema = {
  topicsList: z
    .string()
    .describe(
      `Comma separated list of general documentation topics. E.g. "Installation, Theming". Possible values: ${kdesignGeneralDocsList.join(
        ', ',
      )}. Here is guide on how to decide which general docs you might need:\n ${whichGeneralDocsToUse}`,
    ),
  ...commonKdesignMCPToolSchema,
};

// Schema for HTTP transport
const getKdesignGeneralDocsHttpSchema = {
  ...getKdesignGeneralDocsStdioSchema,
  ...httpTransportSkillVersionSchema,
};

// Core business logic function
const getKdesignGeneralDocsCore = ({
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
  const invalidTopics = topics.filter((topic) => !kdesignGeneralDocsList.includes(topic));
  if (invalidTopics.length > 0) {
    return handleError({
      toolName: getKdesignGeneralDocsToolName,
      mcpErrorMessage: `Invalid argument topicsList. Invalid values: ${invalidTopics.join(
        ', ',
      )}. Valid general docs values: ${kdesignGeneralDocsList.join(', ')}`,
    });
  }

  // Check skill using shouldCreateOrUpdateSkill which handles both file system and version checks
  if (currentProjectRootDirectory) {
    const createOrUpdateSkill = shouldCreateOrUpdateSkill(
      skillVersion,
      currentProjectRootDirectory,
      skipLocalSkillChecks,
      getKdesignGeneralDocsToolName,
    );
    if (createOrUpdateSkill) {
      return createOrUpdateSkill;
    }
  }

  try {
    const responseText = getKdesignDocsResponseText({
      docsList: topicsList,
      documentationType: 'general',
    });

    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: getKdesignGeneralDocsToolName,
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
      toolName: getKdesignGeneralDocsToolName,
      errorObject: error,
    });
  }
};

// Callback for stdio transport
const getKdesignGeneralDocsStdioCallback: ToolCallback<typeof getKdesignGeneralDocsStdioSchema> = ({
  topicsList,
  currentProjectRootDirectory,
  clientName,
}) => {
  return getKdesignGeneralDocsCore({
    topicsList,
    currentProjectRootDirectory,
    skipLocalSkillChecks: false, // Perform skill checks for stdio
    clientName,
  });
};

// Callback for HTTP transport
const getKdesignGeneralDocsHttpCallback: ToolCallback<typeof getKdesignGeneralDocsHttpSchema> = ({
  topicsList,
  skillVersion,
  clientName,
  currentProjectRootDirectory,
}) => {
  return getKdesignGeneralDocsCore({
    topicsList,
    currentProjectRootDirectory,
    skipLocalSkillChecks: true, // Skip local skill checks for HTTP
    skillVersion,
    clientName,
  });
};

export {
  getKdesignGeneralDocsToolName,
  getKdesignGeneralDocsToolDescription,
  getKdesignGeneralDocsHttpCallback,
  getKdesignGeneralDocsStdioCallback,
  getKdesignGeneralDocsHttpSchema,
  getKdesignGeneralDocsStdioSchema,
};
