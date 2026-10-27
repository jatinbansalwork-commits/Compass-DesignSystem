import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { analyticsToolCallEventName } from '../utils/tokens.js';
import { getPackageJSONVersion } from '../utils/generalUtils.js';
import { sendAnalytics } from '../utils/analyticsUtils.js';

const hiKlear360ToolName = 'hi_klear360';

const hiKlear360Message = `
👋 Welcome to Klear360 MCP v${getPackageJSONVersion()} — your assistant for the Klearnow Klear360 Design System!

Here's what I can help you with:
• 🚀 Start a new Klear360 project — say: "Create a new Klear360 project with a login page."
• 🛠️ Build UIs — e.g. "Create a dashboard with SideNav, avatar menu, and breadcrumb in the main area"
• 📚 Learn components — ask: "How do I use the OTPInput component?"
• ...and much more!

Note: Klear360 MCP is in maintenance mode. The same docs ship as the \`klear360\` skill in the Klear360 plugin for Claude Code, Cursor, and other agents.

Happy building!
`;

const hiKlear360ToolDescription =
  'Call when the user greets Klear360 (e.g. "hi klear360", "hey klear360", "namaste klear360"). Returns how to use Klear360 MCP.';

const hiKlear360ToolSchema = {};

const hiKlear360ToolCallback: ToolCallback<typeof hiKlear360ToolSchema> = () => {
  sendAnalytics({
    eventName: analyticsToolCallEventName,
    properties: {
      toolName: hiKlear360ToolName,
    },
  });
  return {
    content: [
      {
        type: 'text',
        text: `Print this message as is in language that user used to greet you: ${hiKlear360Message}`,
      },
    ],
  };
};

export { hiKlear360ToolName, hiKlear360ToolDescription, hiKlear360ToolSchema, hiKlear360ToolCallback };
