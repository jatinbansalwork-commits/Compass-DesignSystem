import { generateKlear360Code } from './blade/main';
import { generateImportsCode } from './blade/utils/imports';
import { convertIntoKlear360Nodes } from './figmaUtils/convertIntoNodes';
import type { Klear360Node } from './types/Klear360';

if (figma.editorType === 'dev' && figma.mode === 'codegen') {
  // Register a callback to the "generate" event
  figma.codegen.on('generate', ({ node }) => {
    const convertedSelection: Klear360Node[] = convertIntoKlear360Nodes([node], null);

    const { component, imports } = generateKlear360Code({
      bladeNodes: convertedSelection,
    });

    return [
      {
        title: 'Imports',
        language: 'TYPESCRIPT',
        code: generateImportsCode(imports ?? {}).trim(),
      },
      {
        title: 'Code',
        language: 'TYPESCRIPT',
        code: component.trim(),
      },
    ];
  });
} else {
  figma.notify('Razorsharp can only be run in Dev mode.');
  figma.closePlugin();
}
