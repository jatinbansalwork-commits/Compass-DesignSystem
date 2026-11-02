import { generateKdesignCode } from './kdesign/main';
import { generateImportsCode } from './kdesign/utils/imports';
import { convertIntoKdesignNodes } from './figmaUtils/convertIntoNodes';
import type { KdesignNode } from './types/Kdesign';

if (figma.editorType === 'dev' && figma.mode === 'codegen') {
  // Register a callback to the "generate" event
  figma.codegen.on('generate', ({ node }) => {
    const convertedSelection: KdesignNode[] = convertIntoKdesignNodes([node], null);

    const { component, imports } = generateKdesignCode({
      kdesignNodes: convertedSelection,
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
