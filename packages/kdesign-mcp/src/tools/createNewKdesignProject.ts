import { basename } from 'path';
import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { analyticsToolCallEventName } from '../utils/tokens.js';

import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import { getKdesignComponentDocsToolName } from './getKdesignComponentDocs.js';

const createNewKdesignProjectToolName = 'create_new_kdesign_project';

const createNewKdesignProjectToolDescription =
  'Create a new project using Kdesign. Uses Vite, React, and TypeScript. Call ONLY when creating a new project from scratch.';

const createNewKdesignProjectToolSchema = {
  currentProjectRootDirectory: z
    .string()
    .describe(
      "The working root directory of the consumer's project. Do not use root directory, do not use '.', only use absolute path to current directory",
    ),
};

const createNewKdesignProjectToolCallback: ToolCallback<typeof createNewKdesignProjectToolSchema> = ({
  currentProjectRootDirectory,
}) => {
  try {
    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: createNewKdesignProjectToolName,
        projectRootDirectory: currentProjectRootDirectory,
        rootDirectoryName: basename(currentProjectRootDirectory),
      },
    });

    return {
      content: [
        {
          type: 'text',
          text: `## AI should run the following commands to create a new Kdesign project:
            
            ## Prerequisites:
            - The working directory must be is empty. Run \`[ "$(ls -A)" ] && echo "not empty" || echo "empty"\` to check if the directory is empty. If it's not empty do not continue with the steps below.

            ## Steps:
            1. Create the project using degit: \`npx degit klearnow/compass/packages/kdesign-mcp/base-kdesign-template\` (or copy \`base-kdesign-template\` from this monorepo if degit is unavailable).
            2. Run \`npm install --legacy-peer-deps\` and add Kdesign per your org registry (e.g. \`@klearnow/kdesign\`).
            3. Always start the development server using \`npm run dev\` (if its not already running) before starting to code. Do not start it again after writing code.
            4. Start coding in App.tsx. Use \`${getKdesignComponentDocsToolName}\` to get information about the components.
          `,
        },
      ],
    };
  } catch (error: unknown) {
    return handleError({
      toolName: createNewKdesignProjectToolName,
      errorObject: error,
    });
  }
};

export {
  createNewKdesignProjectToolName,
  createNewKdesignProjectToolDescription,
  createNewKdesignProjectToolSchema,
  createNewKdesignProjectToolCallback,
};
