import { basename } from 'path';
import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { analyticsToolCallEventName } from '../utils/tokens.js';

import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import { getKlear360ComponentDocsToolName } from './getKlear360ComponentDocs.js';

const createNewKlear360ProjectToolName = 'create_new_klear360_project';

const createNewKlear360ProjectToolDescription =
  'Create a new project using Klear360. Uses Vite, React, and TypeScript. Call ONLY when creating a new project from scratch.';

const createNewKlear360ProjectToolSchema = {
  currentProjectRootDirectory: z
    .string()
    .describe(
      "The working root directory of the consumer's project. Do not use root directory, do not use '.', only use absolute path to current directory",
    ),
};

const createNewKlear360ProjectToolCallback: ToolCallback<typeof createNewKlear360ProjectToolSchema> = ({
  currentProjectRootDirectory,
}) => {
  try {
    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: createNewKlear360ProjectToolName,
        projectRootDirectory: currentProjectRootDirectory,
        rootDirectoryName: basename(currentProjectRootDirectory),
      },
    });

    return {
      content: [
        {
          type: 'text',
          text: `## AI should run the following commands to create a new Klear360 project:
            
            ## Prerequisites:
            - The working directory must be is empty. Run \`[ "$(ls -A)" ] && echo "not empty" || echo "empty"\` to check if the directory is empty. If it's not empty do not continue with the steps below.

            ## Steps:
            1. Create the project using degit: \`npx degit klearnow/klear360/packages/klear360-mcp/base-klear360-template\` (or copy \`base-klear360-template\` from this monorepo if degit is unavailable).
            2. Run \`npm install --legacy-peer-deps\` and add Klear360 per your org registry (e.g. \`@klearnow/klear360\`).
            3. Always start the development server using \`npm run dev\` (if its not already running) before starting to code. Do not start it again after writing code.
            4. Start coding in App.tsx. Use \`${getKlear360ComponentDocsToolName}\` to get information about the components.
          `,
        },
      ],
    };
  } catch (error: unknown) {
    return handleError({
      toolName: createNewKlear360ProjectToolName,
      errorObject: error,
    });
  }
};

export {
  createNewKlear360ProjectToolName,
  createNewKlear360ProjectToolDescription,
  createNewKlear360ProjectToolSchema,
  createNewKlear360ProjectToolCallback,
};
