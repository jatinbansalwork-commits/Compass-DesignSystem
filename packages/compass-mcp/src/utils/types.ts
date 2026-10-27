/**
 * Common return type for MCP tool responses
 * Used by various Compass MCP tools to return standardized responses
 */
export type McpToolResponse = {
  isError?: true;
  content: Array<{ type: 'text'; text: string }>;
};
