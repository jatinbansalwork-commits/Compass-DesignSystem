import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { analyticsToolCallEventName } from '../utils/tokens.js';
import { sendAnalytics, handleError } from '../utils/analyticsUtils.js';
import { getKdesignComponentDocsToolName } from './getKdesignComponentDocs.js';
import { hiKdesignToolName } from './hiKdesign.js';
import { createNewKdesignProjectToolName } from './createNewKdesignProject.js';
import { createKdesignSkillToolName } from './createKdesignSkill.js';
import { getKdesignPatternDocsToolName } from './getKdesignPatternDocs.js';
import { getKdesignGeneralDocsToolName } from './getKdesignGeneralDocs.js';
import { getFigmaToCodeToolName } from './getFigmaToCode.js';
import { getChangelogToolName } from './getChangelog.js';

// List of Kdesign MCP tool names excluding this metric tool
const kdesignMcpToolNames = [
  hiKdesignToolName,
  createNewKdesignProjectToolName,
  createKdesignSkillToolName,
  getKdesignComponentDocsToolName,
  getKdesignPatternDocsToolName,
  getKdesignGeneralDocsToolName,
  getFigmaToCodeToolName,
  getChangelogToolName,
] as const;

type KdesignMcpToolName = typeof kdesignMcpToolNames[number];
// Cast to mutable tuple type expected by z.enum
const kdesignMcpToolEnum = z.enum(
  (kdesignMcpToolNames as unknown) as [KdesignMcpToolName, ...KdesignMcpToolName[]],
);

// Tool constants
const publishLinesOfCodeMetricToolName = 'publish_lines_of_code_metric';
// Detailed description covering how to derive numbers from Git diff statistics.
const publishLinesOfCodeMetricToolDescription = `
Report the **diff size** of the most recent code edit.

The goal is to capture **net code-churn**—how many changes were added and how many were removed—so that the Kdesign team can track adoption and productivity.  Use the same convention that \`git diff --numstat\`  outputs:

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
    "kdesignUiLinesAddedTotal": 10,
    "kdesignUiLinesRemovedTotal": 2,
    "nonKdesignUiLinesAddedTotal": 3,
    "nonKdesignUiLinesRemovedTotal": 1,
    "nonUiLinesAddedTotal": 0,
    "nonUiLinesRemovedTotal": 0,

    "currentProjectRootDirectory": "/Users/alice/projects/my-app",
    "toolsUsed": ["get_kdesign_component_docs", "get_kdesign_pattern_docs"]
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
    .array(kdesignMcpToolEnum)
    .optional()
    .describe('List of Kdesign MCP tool names that were invoked during the conversation'),
  currentProjectRootDirectory: z
    .string()
    .describe(
      "The working root directory of the consumer's project. Do not use root directory, do not use '.', only use absolute path to current directory",
    ),
  // New aggregated metrics for code categorization
  kdesignUiLinesAddedTotal: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe(
      'Total lines of UI code that import or reference Kdesign components (e.g., <Button />, <TextInput />) that were added across all files.',
    ),
  kdesignUiLinesRemovedTotal: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe(
      'Total lines of UI code that import or reference Kdesign components that were removed across all files.',
    ),
  nonKdesignUiLinesAddedTotal: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe(
      'Total lines of UI component code (React/JSX/TSX) added that do NOT import or use Kdesign components — e.g., custom components or components from other libraries such as Material UI',
    ),
  nonKdesignUiLinesRemovedTotal: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe(
      'Total lines of UI component code that does NOT use Kdesign components that were removed across all files.',
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
  kdesignUiLinesAddedTotal,
  kdesignUiLinesRemovedTotal,
  nonKdesignUiLinesAddedTotal,
  nonKdesignUiLinesRemovedTotal,
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
        kdesignUiLinesAddedTotal: kdesignUiLinesAddedTotal ?? 0,
        kdesignUiLinesRemovedTotal: kdesignUiLinesRemovedTotal ?? 0,
        nonKdesignUiLinesAddedTotal: nonKdesignUiLinesAddedTotal ?? 0,
        nonKdesignUiLinesRemovedTotal: nonKdesignUiLinesRemovedTotal ?? 0,
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
