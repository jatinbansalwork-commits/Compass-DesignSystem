import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { analyticsToolCallEventName } from '../utils/tokens.js';
import { sendAnalytics, handleError } from '../utils/analyticsUtils.js';
import { getKlear360ComponentDocsToolName } from './getKlear360ComponentDocs.js';
import { hiKlear360ToolName } from './hiKlear360.js';
import { createNewKlear360ProjectToolName } from './createNewKlear360Project.js';
import { createKlear360SkillToolName } from './createKlear360Skill.js';
import { getKlear360PatternDocsToolName } from './getKlear360PatternDocs.js';
import { getKlear360GeneralDocsToolName } from './getKlear360GeneralDocs.js';
import { getFigmaToCodeToolName } from './getFigmaToCode.js';
import { getChangelogToolName } from './getChangelog.js';

// List of Klear360 MCP tool names excluding this metric tool
const klear360McpToolNames = [
  hiKlear360ToolName,
  createNewKlear360ProjectToolName,
  createKlear360SkillToolName,
  getKlear360ComponentDocsToolName,
  getKlear360PatternDocsToolName,
  getKlear360GeneralDocsToolName,
  getFigmaToCodeToolName,
  getChangelogToolName,
] as const;

type Klear360McpToolName = typeof klear360McpToolNames[number];
// Cast to mutable tuple type expected by z.enum
const klear360McpToolEnum = z.enum(
  (klear360McpToolNames as unknown) as [Klear360McpToolName, ...Klear360McpToolName[]],
);

// Tool constants
const publishLinesOfCodeMetricToolName = 'publish_lines_of_code_metric';
// Detailed description covering how to derive numbers from Git diff statistics.
const publishLinesOfCodeMetricToolDescription = `
Report the **diff size** of the most recent code edit.

The goal is to capture **net code-churn**—how many changes were added and how many were removed—so that the Klear360 team can track adoption and productivity.  Use the same convention that \`git diff --numstat\`  outputs:

* **A new line** → counts as **1 _added_** line.
* **A deleted line** → counts as **1 _removed_** line.
* **A modified line** (content changed in place) → counts as **1 removed** **and** **1 added** (because the old content vanished and new content appeared).

Keep these numbers **exactly** as your diff tool reports them—do **not** try to compensate for whitespace or formatting tweaks.

────────────────────────────────────────────────
# When to Call

After completing all code edits, and **just before** drafting your final summary to the user, call the publish_lines_of_code_metric tool **exactly once**.

────────────────────────────────────────────────
# Example Invocation

\`\`\`json
{
  "name": "publish_lines_of_code_metric",
  "arguments": {
    "files": [
      { "filePath": "src/components/Button.tsx", "linesAdded": 10, "linesRemoved": 2 },
      { "filePath": "src/utils/helpers.ts", "linesAdded": 3, "linesRemoved": 1 }
    ],
    "linesAddedTotal": 13,
    "linesRemovedTotal": 3,

    // Aggregated optional buckets
    "bladeUiLinesAddedTotal": 10,
    "bladeUiLinesRemovedTotal": 2,
    "nonKlear360UiLinesAddedTotal": 3,
    "nonKlear360UiLinesRemovedTotal": 1,
    "nonUiLinesAddedTotal": 0,
    "nonUiLinesRemovedTotal": 0,

    "currentProjectRootDirectory": "/Users/alice/projects/my-app",
    "toolsUsed": ["get_klear360_component_docs", "get_klear360_pattern_docs"]
  }
}
\`\`\`

All numeric fields **must be non-negative integers**.
`;

// Tool schema
const publishLinesOfCodeMetricToolSchema = {
  files: z
    .array(
      z.object({
        filePath: z.string().describe('Path of the file that was edited.'),
        linesAdded: z.number().int().nonnegative().describe('Lines added in this file.'),
        linesRemoved: z.number().int().nonnegative().describe('Lines removed in this file.'),
      }),
    )
    .nonempty()
    .describe('Breakdown of line changes per file in this operation.'),
  linesAddedTotal: z.number().int().nonnegative().describe('Total lines added across all files.'),
  linesRemovedTotal: z
    .number()
    .int()
    .nonnegative()
    .describe('Total lines removed across all files.'),
  toolsUsed: z
    .array(klear360McpToolEnum)
    .optional()
    .describe('List of Klear360 MCP tool names that were invoked during the conversation'),
  currentProjectRootDirectory: z
    .string()
    .describe(
      "The working root directory of the consumer's project. Do not use root directory, do not use '.', only use absolute path to current directory",
    ),
  // New aggregated metrics for code categorization
  bladeUiLinesAddedTotal: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe(
      'Total lines of UI code that import or reference Klear360 components (e.g., <Button />, <TextInput />) that were added across all files.',
    ),
  bladeUiLinesRemovedTotal: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe(
      'Total lines of UI code that import or reference Klear360 components that were removed across all files.',
    ),
  nonKlear360UiLinesAddedTotal: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe(
      'Total lines of UI component code (React/JSX/TSX) added that do NOT import or use Klear360 components — e.g., custom components or components from other libraries such as Material UI',
    ),
  nonKlear360UiLinesRemovedTotal: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe(
      'Total lines of UI component code that does NOT use Klear360 components that were removed across all files.',
    ),
  nonUiLinesAddedTotal: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe(
      'Total lines of non-UI code such as business logic, state management, data fetching, utility functions, etc. that were added.',
    ),
  nonUiLinesRemovedTotal: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe(
      'Total lines of non-UI code such as business logic, state management, data fetching, utility functions, etc. that were removed.',
    ),
};

// Tool callback
const publishLinesOfCodeMetricToolCallback: ToolCallback<
  typeof publishLinesOfCodeMetricToolSchema
> = ({
  files,
  linesAddedTotal,
  linesRemovedTotal,
  toolsUsed,
  currentProjectRootDirectory,
  bladeUiLinesAddedTotal,
  bladeUiLinesRemovedTotal,
  nonKlear360UiLinesAddedTotal,
  nonKlear360UiLinesRemovedTotal,
  nonUiLinesAddedTotal,
  nonUiLinesRemovedTotal,
}) => {
  try {
    // Send analytics event
    const flattenedFiles = files
      .map(({ filePath, linesAdded, linesRemoved }) => `${filePath}:${linesAdded}:${linesRemoved}`)
      .join(',');

    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: publishLinesOfCodeMetricToolName,
        linesAddedTotal,
        linesRemovedTotal,
        bladeUiLinesAddedTotal: bladeUiLinesAddedTotal ?? 0,
        bladeUiLinesRemovedTotal: bladeUiLinesRemovedTotal ?? 0,
        nonKlear360UiLinesAddedTotal: nonKlear360UiLinesAddedTotal ?? 0,
        nonKlear360UiLinesRemovedTotal: nonKlear360UiLinesRemovedTotal ?? 0,
        nonUiLinesAddedTotal: nonUiLinesAddedTotal ?? 0,
        nonUiLinesRemovedTotal: nonUiLinesRemovedTotal ?? 0,
        files: flattenedFiles,
        toolsUsed: (toolsUsed ?? []).join(','),
        currentProjectRootDirectory,
      },
    });

    return {
      content: [
        {
          type: 'text',
          text:
            `Recorded ${linesAddedTotal} lines added and ${linesRemovedTotal} lines removed across ` +
            `${files.length} files. Tools used: ${(toolsUsed ?? []).join(', ')}.`,
        },
      ],
    };
  } catch (error: unknown) {
    return handleError({
      toolName: publishLinesOfCodeMetricToolName,
      errorObject: error,
    });
  }
};

export {
  publishLinesOfCodeMetricToolName,
  publishLinesOfCodeMetricToolDescription,
  publishLinesOfCodeMetricToolSchema,
  publishLinesOfCodeMetricToolCallback,
};
