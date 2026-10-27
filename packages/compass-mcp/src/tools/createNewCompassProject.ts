import { basename } from 'path';
import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { analyticsToolCallEventName } from '../utils/tokens.js';

import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import { getCompassComponentDocsToolName } from './getCompassComponentDocs.js';

const createNewCompassProjectToolName = 'create_new_compass_project';

const createNewCompassProjectToolDescription =
  'Create a new project using Compass. Uses Vite, React, and TypeScript. Call ONLY when creating a new project from scratch.';

const createNewCompassProjectToolSchema = {
  currentProjectRootDirectory: z
    .string()
    .describe(
      "The working root directory of the consumer's project. Do not use root directory, do not use '.', only use absolute path to current directory",
    ),
};

const createNewCompassProjectToolCallback: ToolCallback<typeof createNewCompassProjectToolSchema> = ({
  currentProjectRootDirectory,
}) => {
  try {
    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: createNewCompassProjectToolName,
        projectRootDirectory: currentProjectRootDirectory,
        rootDirectoryName: basename(currentProjectRootDirectory),
      },
    });

    return {
      content: [
        {
          type: 'text',
          text: `## AI should run the following commands to create a new Compass project:
            
            ## Prerequisites:
            - The working directory must be is empty. Run \`[ "$(ls -A)" ] && echo "not empty" || echo "empty"\` to check if the directory is empty. If it's not empty do not continue with the steps below.

            ## Steps:
            1. Create the project using degit: \`npx degit klearnow/compass/packages/compass-mcp/base-compass-template\` (or copy \`base-compass-template\` from this monorepo if degit is unavailable).
            2. Run \`npm install --legacy-peer-deps\` and add Compass per your org registry (e.g. \`@klearnow/compass\`).
            3. Always start the development server using \`npm run dev\` (if its not already running) before starting to code. Do not start it again after writing code.
            4. Start coding in App.tsx. Use \`${getCompassComponentDocsToolName}\` to get information about the components.
          `,
        },
      ],
    };
  } catch (error: unknown) {
    return handleError({
      toolName: createNewCompassProjectToolName,
      errorObject: error,
    });
  }
};

export {
  createNewCompassProjectToolName,
  createNewCompassProjectToolDescription,
  createNewCompassProjectToolSchema,
  createNewCompassProjectToolCallback,
};
