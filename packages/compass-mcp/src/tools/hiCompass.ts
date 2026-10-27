import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { analyticsToolCallEventName } from '../utils/tokens.js';
import { getPackageJSONVersion } from '../utils/generalUtils.js';
import { sendAnalytics } from '../utils/analyticsUtils.js';

const hiCompassToolName = 'hi_compass';

const hiCompassMessage = `
👋 Welcome to Compass MCP v${getPackageJSONVersion()} — your assistant for the Klearnow Compass Design System!

Here's what I can help you with:
• 🚀 Start a new Compass project — say: "Create a new Compass project with a login page."
• 🛠️ Build UIs — e.g. "Create a dashboard with SideNav, avatar menu, and breadcrumb in the main area"
• 📚 Learn components — ask: "How do I use the OTPInput component?"
• ...and much more!

Note: Compass MCP is in maintenance mode. The same docs ship as the \`compass\` skill in the Compass plugin for Claude Code, Cursor, and other agents.

Happy building!
`;

const hiCompassToolDescription =
  'Call when the user greets Compass (e.g. "hi compass", "hey compass", "namaste compass"). Returns how to use Compass MCP.';

const hiCompassToolSchema = {};

const hiCompassToolCallback: ToolCallback<typeof hiCompassToolSchema> = () => {
  sendAnalytics({
    eventName: analyticsToolCallEventName,
    properties: {
      toolName: hiCompassToolName,
    },
  });
  return {
    content: [
      {
        type: 'text',
        text: `Print this message as is in language that user used to greet you: ${hiCompassMessage}`,
      },
    ],
  };
};

export { hiCompassToolName, hiCompassToolDescription, hiCompassToolSchema, hiCompassToolCallback };
