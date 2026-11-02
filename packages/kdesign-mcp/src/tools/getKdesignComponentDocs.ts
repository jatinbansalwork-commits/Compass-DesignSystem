import { basename } from 'path';
import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { analyticsToolCallEventName } from '../utils/tokens.js';
import { getKdesignDocsList } from '../utils/generalUtils.js';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import { getKdesignDocsResponseText } from '../utils/getKdesignDocsResponseText.js';
import { shouldCreateOrUpdateSkill } from '../utils/skillUtils.js';
import type { McpToolResponse } from '../utils/types.js';
import {
  commonKdesignMCPToolSchema,
  httpTransportSkillVersionSchema,
} from '../utils/getCommonSchema.js';

const kdesignComponentsList = getKdesignDocsList('components');
const kdesignComponentsListString = kdesignComponentsList.join(', ');

const getKdesignComponentDocsToolName = 'get_kdesign_component_docs';
const getKdesignComponentDocsToolDescription = `Fetch the Kdesign Design System docs for the given list of components. Use this to get information about the components and their props while adding or changing a component.`;

// Schema for stdio transport
const getKdesignComponentDocsStdioSchema = {
  componentsList: z
    .string()
    .describe(
      `Comma separated list of Kdesign component names. E.g. "Button, Accordion". Use semantic components (like PasswordInput for passwords). Possible values: ${kdesignComponentsListString}`,
    ),
  ...commonKdesignMCPToolSchema,
};

// Schema for HTTP transport
const getKdesignComponentDocsHttpSchema = {
  ...getKdesignComponentDocsStdioSchema,
  ...httpTransportSkillVersionSchema,
};

// Core business logic function
const getKdesignComponentDocsCore = ({
  componentsList,
  currentProjectRootDirectory,
  skipLocalSkillChecks = false,
  skillVersion = '0',
  clientName,
}: {
  componentsList: string;
  currentProjectRootDirectory?: string;
  skipLocalSkillChecks?: boolean;
  skillVersion?: string;
  clientName: 'claude' | 'cursor' | 'unknown';
}): McpToolResponse => {
  const components = componentsList.split(',').map((s) => s.trim());
  const invalidComponents = components.filter((comp) => !kdesignComponentsList.includes(comp));
  const invalidComponentsString = invalidComponents.join(', ');
  if (invalidComponents.length > 0) {
    return handleError({
      toolName: getKdesignComponentDocsToolName,
      mcpErrorMessage: `Invalid argument componentsList. Invalid values: ${invalidComponentsString}. Valid component docs values: ${kdesignComponentsListString}. Make sure to call the parent component name (e.g. instead of calling ListViewFilters, call ListView)`,
    });
  }

  // Check skill using shouldCreateOrUpdateSkill which handles both file system and version checks
  if (currentProjectRootDirectory) {
    const createOrUpdateSkill = shouldCreateOrUpdateSkill(
      skillVersion,
      currentProjectRootDirectory,
      skipLocalSkillChecks,
      getKdesignComponentDocsToolName,
    );
    if (createOrUpdateSkill) {
      return createOrUpdateSkill;
    }
  }

  try {
    const responseText = getKdesignDocsResponseText({
      docsList: componentsList,
      documentationType: 'components',
    });

    // Return the formatted response
    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: getKdesignComponentDocsToolName,
        componentsList,
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
      toolName: getKdesignComponentDocsToolName,
      errorObject: error,
    });
  }
};

// Callback for stdio transport
const getKdesignComponentDocsStdioCallback: ToolCallback<typeof getKdesignComponentDocsStdioSchema> = ({
  componentsList,
  currentProjectRootDirectory,
  clientName,
}) => {
  return getKdesignComponentDocsCore({
    componentsList,
    currentProjectRootDirectory,
    skipLocalSkillChecks: false, // Perform skill checks for stdio
    clientName,
  });
};

// Callback for HTTP transport
const getKdesignComponentDocsHttpCallback: ToolCallback<typeof getKdesignComponentDocsHttpSchema> = ({
  componentsList,
  skillVersion,
  clientName,
  currentProjectRootDirectory,
}) => {
  return getKdesignComponentDocsCore({
    componentsList,
    currentProjectRootDirectory,
    skipLocalSkillChecks: true, // Skip local skill checks for HTTP
    skillVersion,
    clientName,
  });
};

// Export all at once
export {
  getKdesignComponentDocsToolName,
  getKdesignComponentDocsToolDescription,
  getKdesignComponentDocsHttpCallback,
  getKdesignComponentDocsStdioCallback,
  getKdesignComponentDocsStdioSchema,
  getKdesignComponentDocsHttpSchema,
};
