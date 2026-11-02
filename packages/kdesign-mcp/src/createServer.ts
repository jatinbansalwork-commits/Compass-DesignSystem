import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  createNewKdesignProjectToolName,
  createNewKdesignProjectToolDescription,
  createNewKdesignProjectToolSchema,
  createNewKdesignProjectToolCallback,
} from './tools/createNewKdesignProject.js';
import {
  createKdesignSkillToolName,
  createKdesignSkillToolDescription,
  createKdesignSkillToolSchema,
  createKdesignSkillStdioCallback,
  createKdesignSkillHttpCallback,
} from './tools/createKdesignSkill.js';
import {
  getKdesignComponentDocsToolName,
  getKdesignComponentDocsToolDescription,
  getKdesignComponentDocsHttpSchema,
  getKdesignComponentDocsStdioSchema,
  getKdesignComponentDocsStdioCallback,
  getKdesignComponentDocsHttpCallback,
} from './tools/getKdesignComponentDocs.js';
import {
  hiKdesignToolName,
  hiKdesignToolDescription,
  hiKdesignToolSchema,
  hiKdesignToolCallback,
} from './tools/hiKdesign.js';
import { getPackageJSONVersion } from './utils/generalUtils.js';
import {
  getKdesignPatternDocsToolName,
  getKdesignPatternDocsToolDescription,
  getKdesignPatternDocsHttpSchema,
  getKdesignPatternDocsHttpCallback,
  getKdesignPatternDocsStdioSchema,
  getKdesignPatternDocsStdioCallback,
} from './tools/getKdesignPatternDocs.js';
import {
  getKdesignGeneralDocsToolName,
  getKdesignGeneralDocsToolDescription,
  getKdesignGeneralDocsHttpCallback,
  getKdesignGeneralDocsHttpSchema,
  getKdesignGeneralDocsStdioSchema,
  getKdesignGeneralDocsStdioCallback,
} from './tools/getKdesignGeneralDocs.js';
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
    createKdesignSkillToolName,
    createKdesignSkillToolDescription,
    createKdesignSkillToolSchema,
    createKdesignSkillHttpCallback,
  );

  server.tool(
    getKdesignComponentDocsToolName,
    getKdesignComponentDocsToolDescription,
    getKdesignComponentDocsHttpSchema,
    getKdesignComponentDocsHttpCallback,
  );

  server.tool(
    getKdesignPatternDocsToolName,
    getKdesignPatternDocsToolDescription,
    getKdesignPatternDocsHttpSchema,
    getKdesignPatternDocsHttpCallback,
  );

  server.tool(
    getKdesignGeneralDocsToolName,
    getKdesignGeneralDocsToolDescription,
    getKdesignGeneralDocsHttpSchema,
    getKdesignGeneralDocsHttpCallback,
  );
};

const stdioServerTools = (server: McpServer): void => {
  server.tool(
    createKdesignSkillToolName,
    createKdesignSkillToolDescription,
    createKdesignSkillToolSchema,
    createKdesignSkillStdioCallback,
  );

  server.tool(
    getKdesignComponentDocsToolName,
    getKdesignComponentDocsToolDescription,
    getKdesignComponentDocsStdioSchema,
    getKdesignComponentDocsStdioCallback,
  );

  server.tool(
    getKdesignPatternDocsToolName,
    getKdesignPatternDocsToolDescription,
    getKdesignPatternDocsStdioSchema,
    getKdesignPatternDocsStdioCallback,
  );

  server.tool(
    getKdesignGeneralDocsToolName,
    getKdesignGeneralDocsToolDescription,
    getKdesignGeneralDocsStdioSchema,
    getKdesignGeneralDocsStdioCallback,
  );
};
export const createServer = ({
  transportType = 'stdio',
}: {
  transportType?: 'stdio' | 'http';
}): McpServer => {
  const server = new McpServer({
    name: 'Kdesign MCP',
    version: getPackageJSONVersion(),
  });

  setMcpSseAnalyticsContext({ protocol: transportType });

  if (transportType === 'http') {
    httpsServerTools(server);
  } else {
    stdioServerTools(server);
  }

  server.tool(hiKdesignToolName, hiKdesignToolDescription, hiKdesignToolSchema, hiKdesignToolCallback);

  server.tool(
    createNewKdesignProjectToolName,
    createNewKdesignProjectToolDescription,
    createNewKdesignProjectToolSchema,
    createNewKdesignProjectToolCallback,
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
