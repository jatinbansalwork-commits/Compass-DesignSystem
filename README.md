<br/>
<p align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./branding/klear360-original-dark-mode.min.svg">
  <source media="(prefers-color-scheme: light)" srcset="./branding/klear360-original.min.svg">
  <img width="450px" alt="Klear360 Design System Logo" src="./branding/klear360-original.min.svg">
</picture>
</p>

<br/>

<p align="center">
  <a href="https://npmjs.org/package/@klearnow/klear360"><img alt="Klear360 Latest Version" src="https://img.shields.io/npm/v/@klearnow/klear360?style=for-the-badge&labelColor=322&logo=npm&label=@klearnow/klear360&color=darkred"></a> &nbsp;<a href="https://design.klearnow.com/"><img alt="Documentation design.klearnow.com" src="https://img.shields.io/badge/Documentation-design.klearnow.com-0648EF?style=for-the-badge&labelColor=0012AD&logo=readthedocs&logoColor=eee"/></a> &nbsp;<a href="https://github.com/klearnow/klear360/tree/master/CONTRIBUTING.md"><img alt="Discord Join Chat" src="https://img.shields.io/badge/Contributions-Open-333333?style=for-the-badge&logo=github&logoColor=ffffff&labelColor=111111"/></a></p>

<h1 aria-hidden="true"></h1>

<br/>

Klear360 is the Design System that powers [Klearnow](https://klearnow.ai/).

## 🔗 Links

- [Docs](https://design.klearnow.com)
- [Installation](https://design.klearnow.com/?path=/docs/guides-installation--docs)
- [@klearnow/klear360-legacy](https://github.com/klearnow/klear360-legacy) (Deprecated, Private)

## ✨ Features

- Cross-Platform (Works Natively on [React Web and React Native](https://design.klearnow.com/?path=/docs/guides-installation--docs))
- [White Labelling](https://design.klearnow.com/?path=/docs/guides-theming-theme-playground--docs)
- [Accessible](https://design.klearnow.com/?path=/docs/guides-accessibility--docs)
- Documented [API decisions](./packages/klear360/src/components/Alert/_decisions/decisions.md)

## 📦 Monorepo Structure

This repository is organized as a monorepo containing several packages that work together to provide a complete design system ecosystem.

### Packages

| Package                                                                              | Description                                                                                                            |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| [klear360](./packages/klear360/)                                                           | The core Klear360 Design System package with cross-platform UI components for React Web and React Native                  |
| [klear360-plugin](./packages/klear360-plugin/)                                             | Claude Code plugin and cross-agent skills with the Klear360 knowledgebase (source of truth for AI docs)                   |
| [klear360-mcp](./packages/klear360-mcp/)                                                   | Model Context Protocol (MCP) server for AI-assisted development using Klear360 components (maintenance mode)              |
| [plugin-figma-klear360-coverage](./packages/plugin-figma-klear360-coverage/)               | Figma plugin that measures Klear360 component usage and coverage in design files. It acts like a linter for design files. |
| [plugin-figma-token-publisher](./packages/plugin-figma-token-publisher/)             | Figma plugin for publishing design tokens                                                                              |
| [klear360-coverage-extension](./packages/klear360-coverage-extension/)                     | Browser extension for measuring Klear360 component usage                                                                  |
| [eslint-plugin-klear360](./packages/eslint-plugin-klear360/)                               | ESLint plugin for enforcing Klear360 coding standards                                                                     |
| [widget-figma-dev-handoff-checklist](./packages/widget-figma-dev-handoff-checklist/) | Figma widget for design-to-development handoff checklists                                                              |

<p align="center">Interested in working with us? See <a href="https://klearnow.ai/careers">Klearnow careers</a>.</p>
