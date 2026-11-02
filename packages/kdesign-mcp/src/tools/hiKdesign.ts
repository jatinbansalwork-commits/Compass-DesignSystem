import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { analyticsToolCallEventName } from '../utils/tokens.js';
import { getPackageJSONVersion } from '../utils/generalUtils.js';
import { sendAnalytics } from '../utils/analyticsUtils.js';

const hiKdesignToolName = 'hi_kdesign';

const hiKdesignMessage = `
👋 Welcome to Kdesign MCP v${getPackageJSONVersion()} — your assistant for the Klearnow Kdesign Design System!

Here's what I can help you with:
• 🚀 Start a new Kdesign project — say: "Create a new Kdesign project with a login page."
• 🛠️ Build UIs — e.g. "Create a dashboard with SideNav, avatar menu, and breadcrumb in the main area"
• 📚 Learn components — ask: "How do I use the OTPInput component?"
• ...and much more!

Note: Kdesign MCP is in maintenance mode. The same docs ship as the \`kdesign\` skill in the Kdesign plugin for Claude Code, Cursor, and other agents.

Happy building!
`;

const hiKdesignToolDescription =
  'Call when the user greets Kdesign (e.g. "hi kdesign", "hey kdesign", "namaste kdesign"). Returns how to use Kdesign MCP.';

const hiKdesignToolSchema = {};

const hiKdesignToolCallback: ToolCallback<typeof hiKdesignToolSchema> = () => {
  sendAnalytics({
    eventName: analyticsToolCallEventName,
    properties: {
      toolName: hiKdesignToolName,
    },
  });
  return {
    content: [
      {
        type: 'text',
        text: `Print this message as is in language that user used to greet you: ${hiKdesignMessage}`,
      },
    ],
  };
};

export { hiKdesignToolName, hiKdesignToolDescription, hiKdesignToolSchema, hiKdesignToolCallback };
