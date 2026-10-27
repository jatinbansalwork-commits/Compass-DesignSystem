import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  createNewCompassProjectToolName,
  createNewCompassProjectToolDescription,
  createNewCompassProjectToolSchema,
  createNewCompassProjectToolCallback,
} from './tools/createNewCompassProject.js';
import {
  createCompassSkillToolName,
  createCompassSkillToolDescription,
  createCompassSkillToolSchema,
  createCompassSkillStdioCallback,
  createCompassSkillHttpCallback,
} from './tools/createCompassSkill.js';
import {
  getCompassComponentDocsToolName,
  getCompassComponentDocsToolDescription,
  getCompassComponentDocsHttpSchema,
  getCompassComponentDocsStdioSchema,
  getCompassComponentDocsStdioCallback,
  getCompassComponentDocsHttpCallback,
} from './tools/getCompassComponentDocs.js';
import {
  hiCompassToolName,
  hiCompassToolDescription,
  hiCompassToolSchema,
  hiCompassToolCallback,
} from './tools/hiCompass.js';
import { getPackageJSONVersion } from './utils/generalUtils.js';
import {
  getCompassPatternDocsToolName,
  getCompassPatternDocsToolDescription,
  getCompassPatternDocsHttpSchema,
  getCompassPatternDocsHttpCallback,
  getCompassPatternDocsStdioSchema,
  getCompassPatternDocsStdioCallback,
} from './tools/getCompassPatternDocs.js';
import {
  getCompassGeneralDocsToolName,
  getCompassGeneralDocsToolDescription,
  getCompassGeneralDocsHttpCallback,
  getCompassGeneralDocsHttpSchema,
  getCompassGeneralDocsStdioSchema,
  getCompassGeneralDocsStdioCallback,
} from './tools/getCompassGeneralDocs.js';
import {
  getFigmaToCodeToolName,
  getFigmaToCodeToolDescription,
  getFigmaToCodeToolSchema,
  getFigmaToCodeToolCallback,
} from './tools/getFigmaToCode.js';
import {
  getChangelogToolName,
  getChangelogToolDescription,
  getChangelogToolSchema,
  getChangelogToolCallback,
} from './tools/getChangelog.js';
import {
  publishLinesOfCodeMetricToolName,
  publishLinesOfCodeMetricToolDescription,
  publishLinesOfCodeMetricToolSchema,
  publishLinesOfCodeMetricToolCallback,
} from './tools/publishLinesOfCodeMetric.js';
import { setMcpSseAnalyticsContext } from './utils/analyticsUtils.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const httpsServerTools = (server: McpServer): void => {
  server.tool(
    createCompassSkillToolName,
    createCompassSkillToolDescription,
    createCompassSkillToolSchema,
    createCompassSkillHttpCallback,
  );

  server.tool(
    getCompassComponentDocsToolName,
    getCompassComponentDocsToolDescription,
    getCompassComponentDocsHttpSchema,
    getCompassComponentDocsHttpCallback,
  );

  server.tool(
    getCompassPatternDocsToolName,
    getCompassPatternDocsToolDescription,
    getCompassPatternDocsHttpSchema,
    getCompassPatternDocsHttpCallback,
  );

  server.tool(
    getCompassGeneralDocsToolName,
    getCompassGeneralDocsToolDescription,
    getCompassGeneralDocsHttpSchema,
    getCompassGeneralDocsHttpCallback,
  );
};

const stdioServerTools = (server: McpServer): void => {
  server.tool(
    createCompassSkillToolName,
    createCompassSkillToolDescription,
    createCompassSkillToolSchema,
    createCompassSkillStdioCallback,
  );

  server.tool(
    getCompassComponentDocsToolName,
    getCompassComponentDocsToolDescription,
    getCompassComponentDocsStdioSchema,
    getCompassComponentDocsStdioCallback,
  );

  server.tool(
    getCompassPatternDocsToolName,
    getCompassPatternDocsToolDescription,
    getCompassPatternDocsStdioSchema,
    getCompassPatternDocsStdioCallback,
  );

  server.tool(
    getCompassGeneralDocsToolName,
    getCompassGeneralDocsToolDescription,
    getCompassGeneralDocsStdioSchema,
    getCompassGeneralDocsStdioCallback,
  );
};
export const createServer = ({
  transportType = 'stdio',
}: {
  transportType?: 'stdio' | 'http';
}): McpServer => {
  const server = new McpServer({
    name: 'Compass MCP',
    version: getPackageJSONVersion(),
  });

  setMcpSseAnalyticsContext({ protocol: transportType });

  if (transportType === 'http') {
    httpsServerTools(server);
  } else {
    stdioServerTools(server);
  }

  server.tool(hiCompassToolName, hiCompassToolDescription, hiCompassToolSchema, hiCompassToolCallback);

  server.tool(
    createNewCompassProjectToolName,
    createNewCompassProjectToolDescription,
    createNewCompassProjectToolSchema,
    createNewCompassProjectToolCallback,
  );

  server.tool(
    getFigmaToCodeToolName,
    getFigmaToCodeToolDescription,
    getFigmaToCodeToolSchema,
    getFigmaToCodeToolCallback,
  );

  server.tool(
    getChangelogToolName,
    getChangelogToolDescription,
    getChangelogToolSchema,
    getChangelogToolCallback,
  );

  server.tool(
    publishLinesOfCodeMetricToolName,
    publishLinesOfCodeMetricToolDescription,
    publishLinesOfCodeMetricToolSchema,
    publishLinesOfCodeMetricToolCallback,
  );

  return server;
};
