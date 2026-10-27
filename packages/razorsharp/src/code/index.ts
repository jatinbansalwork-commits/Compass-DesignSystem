import { generateCompassCode } from './blade/main';
import { generateImportsCode } from './blade/utils/imports';
import { convertIntoCompassNodes } from './figmaUtils/convertIntoNodes';
import type { CompassNode } from './types/Compass';

if (figma.editorType === 'dev' && figma.mode === 'codegen') {
  // Register a callback to the "generate" event
  figma.codegen.on('generate', ({ node }) => {
    const convertedSelection: CompassNode[] = convertIntoCompassNodes([node], null);

    const { component, imports } = generateCompassCode({
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
