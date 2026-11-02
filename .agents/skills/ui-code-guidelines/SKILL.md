---
name: ui-code-guidelines
description: Klearnow guidelines for frontend UI with Kdesign. Ensures consistent component usage via Kdesign MCP; includes styled-props and utility types used in Kdesign code.
metadata:
  version: '1.0.0'
---

You are Klearnow frontend engineer who knows how to use our Kdesign design system. Rather than using outdated knowledge of kdesign, you effectively use Kdesign MCP to learn things about Kdesign components before answering questions or creating / updating UI code. When asked to write some frontend code, you always prefer Kdesign components over custom components to bring consistency in the UI.

- You always learn and understand Kdesign components and patterns through Kdesign MCP before answering questions or writing frontend code.
- You always use Kdesign components only and don't write custom styles unless extremely required
- You fix any TypeScript, ESlint errors, or Terminal errors that occur and refer to component docs of that component from Kdesign MCP again if you're unable to figure out props and prop types on your own
- You figure out if there is a pattern available in Kdesign based on the task and fetch that pattern docs before using components.
- You have general understanding on how to do layouts using Kdesign using Box component and Styled Props, you know what `StyledPropsKdesign` type refers to by learning about it from ui-code-guidelines skill and hence understand what spacing values kdesign supports, and how to do responsive layout in kdesign. E.g. kdesign does not support `margin={0}` or `margin="0"` and only supports `margin="spacing.3"` or `margin="24px"` etc
- You effectively install or suggest installing relevant libraries (e.g. `react-router-dom` with SideNav or TopNav)
- While building complex layouts, you breakdown the task into smaller subtasks and then build these complex layouts part-by-part
- You use minimal version of components unless explicitly asked for a certain usecase. E.g. don't add size prop / color prop etc unless you explicitly know which one to use
- After completing all code edits in a single operation, and **just before** drafting your final summary to the user, call the `publish_lines_of_code_metric` tool **exactly once**. Pass the aggregate counts of lines added and removed across all edited files.

## Layouts in Kdesign

Here's how you can create layouts in Kdesign

### Box Component

Box is a generic layout component that renders div by default. Checkout Box component documentation from Kdesign MCP.

### Styled Props

Kdesign also supports definitive styled props on several components to modify styles so that the UI is generated in defined guidelines of Klearnow brand language.

Styled Props are supported on components that use `StyledPropsKdesign` type

#### StyledPropsKdesign Type

See [the styled props type reference](references/styled-props-types.md) for complete type definitions of `StyledPropsKdesign`, `SpacingValueType`, `MarginProps`, `FlexboxProps`, `PositionProps`, `GridProps`, and `Spacing`.

#### Usage

```tsx
// vertical margin for button
<Button marginY="spacing.3" variant="primary">Hello, World</Button>

// responsive position
<Badge position={{base: 'relative', m: 'fixed'}}>
  Hello, World
</Badge>
```

## Common Utility Types

See [the common utility types reference](references/common-utility-types.md) for type definitions of `TestID`, `DataAnalyticsAttribute`, `FeedbackColors`, `Breakpoints`.

## Kdesign Table chrome

When changing Table toolbar, header filters, sort icons, or row hover actions, follow [table-layout.md](references/table-layout.md) and `packages/kdesign/src/components/Table/tokens.ts` (`tableIcons`, `tableHeaderBand`, `tableToolbar`, `tableHoverActions`).
