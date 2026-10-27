import { basename } from 'path';
import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { analyticsToolCallEventName } from '../utils/tokens.js';
import { getCompassDocsList } from '../utils/generalUtils.js';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import { getCompassDocsResponseText } from '../utils/getCompassDocsResponseText.js';
import { shouldCreateOrUpdateSkill } from '../utils/skillUtils.js';
import type { McpToolResponse } from '../utils/types.js';
import {
  commonCompassMCPToolSchema,
  httpTransportSkillVersionSchema,
} from '../utils/getCommonSchema.js';

const compassComponentsList = getCompassDocsList('components');
const compassComponentsListString = compassComponentsList.join(', ');

const getCompassComponentDocsToolName = 'get_compass_component_docs';
const getCompassComponentDocsToolDescription = `Fetch the Compass Design System docs for the given list of components. Use this to get information about the components and their props while adding or changing a component.`;

// Schema for stdio transport
const getCompassComponentDocsStdioSchema = {
  componentsList: z
    .string()
    .describe(
      `Comma separated list of Compass component names. E.g. "Button, Accordion". Use semantic components (like PasswordInput for passwords). Possible values: ${compassComponentsListString}`,
    ),
  ...commonCompassMCPToolSchema,
};

// Schema for HTTP transport
const getCompassComponentDocsHttpSchema = {
  ...getCompassComponentDocsStdioSchema,
  ...httpTransportSkillVersionSchema,
};

// Core business logic function
const getCompassComponentDocsCore = ({
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
  const invalidComponents = components.filter((comp) => !compassComponentsList.includes(comp));
  const invalidComponentsString = invalidComponents.join(', ');
  if (invalidComponents.length > 0) {
    return handleError({
      toolName: getCompassComponentDocsToolName,
      mcpErrorMessage: `Invalid argument componentsList. Invalid values: ${invalidComponentsString}. Valid component docs values: ${compassComponentsListString}. Make sure to call the parent component name (e.g. instead of calling ListViewFilters, call ListView)`,
    });
  }

  // Check skill using shouldCreateOrUpdateSkill which handles both file system and version checks
  if (currentProjectRootDirectory) {
    const createOrUpdateSkill = shouldCreateOrUpdateSkill(
      skillVersion,
      currentProjectRootDirectory,
      skipLocalSkillChecks,
      getCompassComponentDocsToolName,
    );
    if (createOrUpdateSkill) {
      return createOrUpdateSkill;
    }
  }

  try {
    const responseText = getCompassDocsResponseText({
      docsList: componentsList,
      documentationType: 'components',
    });

    // Return the formatted response
    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: getCompassComponentDocsToolName,
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
      toolName: getCompassComponentDocsToolName,
      errorObject: error,
    });
  }
};

// Callback for stdio transport
const getCompassComponentDocsStdioCallback: ToolCallback<typeof getCompassComponentDocsStdioSchema> = ({
  componentsList,
  currentProjectRootDirectory,
  clientName,
}) => {
  return getCompassComponentDocsCore({
    componentsList,
    currentProjectRootDirectory,
    skipLocalSkillChecks: false, // Perform skill checks for stdio
    clientName,
  });
};

// Callback for HTTP transport
const getCompassComponentDocsHttpCallback: ToolCallback<typeof getCompassComponentDocsHttpSchema> = ({
  componentsList,
  skillVersion,
  clientName,
  currentProjectRootDirectory,
}) => {
  return getCompassComponentDocsCore({
    componentsList,
    currentProjectRootDirectory,
    skipLocalSkillChecks: true, // Skip local skill checks for HTTP
    skillVersion,
    clientName,
  });
};

// Export all at once
export {
  getCompassComponentDocsToolName,
  getCompassComponentDocsToolDescription,
  getCompassComponentDocsHttpCallback,
  getCompassComponentDocsStdioCallback,
  getCompassComponentDocsStdioSchema,
  getCompassComponentDocsHttpSchema,
};
