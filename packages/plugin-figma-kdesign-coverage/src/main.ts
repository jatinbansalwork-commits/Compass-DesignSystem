// List for Coverage Plugin:
// [x] Add Card check for border radius
// [x] Add tokens to coverage % - done
// [x] Add card check for frames for custom components - done
// [x] Add check for override of tokens - done
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import {
  getParentNode,
  traverseNode,
  getSelectedNodesOrAllNodes,
} from '@create-figma-plugin/utilities';

import {
  KDESIGN_BOX_BACKGROUND_COLOR_VARIABLE_IDS,
  KDESIGN_BOX_BORDER_COLOR_VARIABLE_IDS,
  KDESIGN_COMPONENT_IDS,
  KDESIGN_COMPONENT_IDS_HAVING_SLOT,
  KDESIGN_TEXT_COLOR_STYLE_IDS,
  KDESIGN_TEXT_TYPEFACE_STYLE_IDS,
  KDESIGN_EFFECT_STYLE_IDS,
  kdesignThemeData,
} from './kdesignLibraryConstants';
import { sendAnalytics } from './utils/sendAnalytics';

type CoverageMetrics = {
  kdesignComponents: number;
  kdesignTextStyles: number;
  kdesignColorStyles: number;
  // kdesignEffectStyles: number;
  patternsUsed: number;
  nonKdesignComponents: number;
  nonKdesignTextStyles: number;
  nonKdesignColorStyles: number;
  // nonKdesignEffectStyles: number;
  totalLayers: number;
  kdesignCoverage: number;
};

const MAIN_FRAME_NODES = ['FRAME', 'SECTION'];
// `@figma/plugin-typings` has no SlotNode yet, so slots can only be recognised by their runtime
// type string. Keep it here so every comparison stays in sync.
const SLOT_NODE_TYPE = 'SLOT';
const NODES_SKIP_FROM_COVERAGE = [
  'GROUP',
  'SECTION',
  // a SLOT is a placeholder that belongs to the component's own definition, not to the designer.
  // whatever gets dropped into it is still traversed and measured, so counting or flagging the
  // slot itself would both mark Kdesign internals as non-Kdesign and inflate the layer count
  SLOT_NODE_TYPE,
  'VECTOR',
  'ELLIPSE',
  'INSTANCE',
  'COMPONENT',
  'COMPONENT_SET',
];
const nonKdesignHighlighterNodes: BaseNode[] = [];
const kdesignCoverageCards: BaseNode[] = [];
const PATTERN_SHARED_DATA_NAMESPACE = 'kdesign.pattern';
const PATTERN_SHARED_DATA_KEY = 'isPattern';
const TRUTHY_SHARED_DATA_VALUES = ['true', '1', 'yes'];
const PATTERN_LAYER_NAME_TAGS = ['@kdesign-pattern-node'];

const isPatternFrameExemptNode = (node: SceneNode): boolean => {
  const normalizedNodeName = node.name.toLowerCase();
  const hasPatternTagInName = PATTERN_LAYER_NAME_TAGS.some((tag) =>
    normalizedNodeName.includes(tag),
  );
  if (hasPatternTagInName) {
    return true;
  }

  const sharedPluginDataValue = node
    .getSharedPluginData(PATTERN_SHARED_DATA_NAMESPACE, PATTERN_SHARED_DATA_KEY)
    .trim()
    .toLowerCase();

  return TRUTHY_SHARED_DATA_VALUES.includes(sharedPluginDataValue);
};

const isKdesignInstance = (node: BaseNode): node is InstanceNode =>
  node.type === 'INSTANCE' &&
  (KDESIGN_COMPONENT_IDS.includes((node.mainComponent?.parent as ComponentSetNode)?.key ?? '') ||
    KDESIGN_COMPONENT_IDS.includes(node.mainComponent?.key ?? ''));

/**
 * Outside of slots, Figma does not allow adding or removing children of an instance, so any plain
 * FRAME found inside one belongs to that component's own definition rather than to the designer.
 * When the owning component is Kdesign's, that frame is internal chrome we should ignore entirely.
 *
 * Slots are the exception: they are the one place where a descendant of an instance is authored by
 * the designer, so anything below a SLOT stays in the coverage no matter which component owns it.
 *
 * Past that, only the nearest instance decides. A custom component dropped into a Kdesign slot still
 * owns its frames, so those must keep showing up in the coverage.
 */
const isInsideKdesignComponent = (node: BaseNode): boolean => {
  let currentNode = node.parent;
  while (currentNode && currentNode.type !== 'PAGE' && currentNode.type !== 'DOCUMENT') {
    // the plugin typings have no SlotNode yet, so the runtime type has to be compared as a string
    if ((currentNode.type as string) === SLOT_NODE_TYPE) {
      return false;
    }
    if (currentNode.type === 'INSTANCE') {
      return isKdesignInstance(currentNode);
    }
    currentNode = currentNode.parent;
  }
  return false;
};

const highlightNonKdesignNode = (node: SceneNode, desc?: string): void => {
  const highlighterBox = figma.createRectangle();
  const nodeType = `${node.type
    .toUpperCase()
    .charAt(0)
    .toUpperCase()}${node.type.toLowerCase().slice(1)}`;
  highlighterBox.name = `${desc}, Type: ${nodeType}, Name: ${node.name}`;
  // selection node just gives the x and y relative to the frame we need WRT canvas hence, we need to use absoluteTransform prop
  highlighterBox.x = node.absoluteTransform[0][2] - 1;
  highlighterBox.y = node.absoluteTransform[1][2] - 1;
  highlighterBox.resize(node.width + 2, node.height + 2);
  highlighterBox.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];
  highlighterBox.strokes = [{ type: 'SOLID', color: { r: 0.7, g: 0, b: 0 } }];
  nonKdesignHighlighterNodes.push(highlighterBox);
};

const traverseUpTillMainFrame = (node: BaseNode): BaseNode => {
  try {
    if (node !== null) {
      if (getParentNode(node)?.type === 'PAGE') {
        return node;
      } else if (node.parent) {
        return traverseUpTillMainFrame(node.parent);
      }
    }
  } catch (error: unknown) {
    console.error(error);
    figma.notify('⚠️ Error in traversing main frame node. Please try again');
    figma.closePlugin();
  }

  return node;
};

const renderCoverageCard = async ({
  mainFrameNode,
  kdesignComponents,
  patternsUsed,
  nonKdesignComponents,
  nonKdesignColorStyles,
  nonKdesignTextStyles,
  totalLayers,
  kdesignCoverage,
}: {
  mainFrameNode: SceneNode;
} & CoverageMetrics): Promise<void> => {
  // these are from payment light theme but it should work as far as the plugin is being run from Klearnow org
  const COVERAGE_CARD_COMPONENT_KEY = 'c5744871a8db11b02c65b4843d68779f2ff99ed3';
  const KDESIGN_INTENT_COLOR_KEYS = {
    positive: {
      id: '',
      keyVariable: '6489b823f0ea6a46820027c92b5650d0d7950350',
    },
    negative: {
      id: '',
      keyVariable: '11c2fb911f47d4f8dc6ff648c2e9c6ee2ee3f2b9',
    },
    notice: {
      id: '',
      keyVariable: '6fe5b15560ece4139ebacb2ae64f93892761d858',
    },
  };

  try {
    const coverageCardComponent = await figma.importComponentByKeyAsync(
      COVERAGE_CARD_COMPONENT_KEY,
    );
    const coverageCardInstance = coverageCardComponent.createInstance();
    coverageCardInstance.visible = false;
    if (mainFrameNode.width < 500) {
      coverageCardInstance.x = mainFrameNode.x + 20; // for mobile screens the card shouldn't offset a lot
    } else {
      coverageCardInstance.x = mainFrameNode.x + 150; // 150 because we want to prevent conflict with the frame name
    }
    coverageCardInstance.y = mainFrameNode.y - coverageCardComponent.height;

    // import styles for positive, negative and notice colors and set their id in KDESIGN_INTENT_COLOR_KEYS
    for await (const [intent, intentObject] of Object.entries(KDESIGN_INTENT_COLOR_KEYS)) {
      // const colorStyle = await figma.importStyleByKeyAsync(intentObject.keyStyle);
      const colorVariable = await figma.variables.importVariableByKeyAsync(
        intentObject.keyVariable,
      );
      // KDESIGN_INTENT_COLOR_KEYS[intent as 'positive' | 'negative' | 'notice'].id = colorStyle.id;
      KDESIGN_INTENT_COLOR_KEYS[intent as 'positive' | 'negative' | 'notice'].id = colorVariable.id;
    }

    let coverageColorIntent = KDESIGN_INTENT_COLOR_KEYS.negative.id;
    let kdesignCoverageType = 'Below 95% 😪';
    // only used if the Progress node's track parent can't be measured
    const PROGRESS_BAR_FALLBACK_WIDTH = 298;

    // calculate coverage type and intent colors for coverage
    if (kdesignCoverage > 95) {
      kdesignCoverageType = `Good 🎉`;
      coverageColorIntent = KDESIGN_INTENT_COLOR_KEYS.positive.id;
    }

    coverageCardInstance.setProperties({
      'kdesignCoverageType#45789:0': kdesignCoverageType,
      'kdesignCoverage#45789:1': `${kdesignCoverage.toFixed(2)}%`,
      'totalLayers#45789:2': totalLayers.toString().padStart(2, '0'),
      'kdesignComponents#45789:3': kdesignComponents.toString().padStart(2, '0'),
      'nonKdesignComponents#45789:4': nonKdesignComponents.toString().padStart(2, '0'),
      'nonKdesignTextStyles#45789:5': nonKdesignTextStyles.toString().padStart(2, '0'),
      'nonKdesignColorStyles#45789:6': nonKdesignColorStyles.toString().padStart(2, '0'),
      'patternUsage#123665:0': patternsUsed.toString().padStart(2, '0'),
    });

    const detachedCoverageCard = coverageCardInstance.detachInstance();

    // Function to create a paint object bound to a variable
    const createVariableBoundPaint = (variableId: string): SolidPaint => ({
      type: 'SOLID',
      // Optional: provide a fallback color if the variable isn't resolvable,
      // though Figma typically handles this.
      color: { r: 0, g: 0, b: 0 }, // Example fallback
      boundVariables: {
        color: {
          type: 'VARIABLE_ALIAS',
          id: variableId,
        },
      },
    });

    traverseNode(detachedCoverageCard, (traversedNode) => {
      if (traversedNode.type === 'TEXT') {
        if (['kdesignCoverageType', 'kdesignCoverage'].includes(traversedNode.name)) {
          const newFill = createVariableBoundPaint(coverageColorIntent);
          traversedNode.fills = [newFill];
        }
      } else if (traversedNode.type === 'RECTANGLE' && traversedNode.name === 'Progress') {
        // measure the track (the parent ProgressBar frame) instead of hardcoding a width,
        // so the fill stays accurate if the coverage card gets resized in Figma
        const track = traversedNode.parent;
        const trackWidth = track && 'width' in track ? track.width : PROGRESS_BAR_FALLBACK_WIDTH;
        const trackHeight = track && 'height' in track ? track.height : traversedNode.height;
        traversedNode.resizeWithoutConstraints(
          (kdesignCoverage / 100) * trackWidth || 0.1,
          trackHeight,
        );
        const newFill = createVariableBoundPaint(coverageColorIntent);
        traversedNode.fills = [newFill];
      }
    });
    detachedCoverageCard.visible = true;
    kdesignCoverageCards.push(detachedCoverageCard);
  } catch (error: unknown) {
    figma.notify('⚠️ Error in rendering coverage card. Please try again');
    console.error(error);
    figma.closePlugin();
  }
};

const calculateCoverage = (node: SceneNode): CoverageMetrics | null => {
  let kdesignComponents = 0;
  let kdesignTextStyles = 0;
  let kdesignColorStyles = 0;
  // let kdesignEffectStyles = 0;
  let patternsUsed = 0;
  let nonKdesignComponents = 0;
  let nonKdesignTextStyles = 0;
  let nonKdesignColorStyles = 0;
  // let nonKdesignEffectStyles = 0;
  let totalLayers = 0;
  let kdesignCoverage = 0;
  const exemptedNodeIds = new Set<string>();

  try {
    // if there are non-frame nodes as direct children of a page, ignore them
    if (getParentNode(node)?.type === 'PAGE' && !MAIN_FRAME_NODES.includes(node.type)) {
      return null;
    }

    traverseNode(
      node,
      (traversedNode) => {
        if (!traversedNode.visible) {
          return;
        }
        const isPatternExemptFrameNode = isPatternFrameExemptNode(traversedNode);
        if (isPatternExemptFrameNode && !exemptedNodeIds.has(traversedNode.id)) {
          patternsUsed++;
          exemptedNodeIds.add(traversedNode.id);
        }
        // this condition is required to run coverage on component sets which are components built locally using Kdesign components
        const isLocalComponent =
          traversedNode.type === 'COMPONENT' || traversedNode.type === 'COMPONENT_SET';

        if (isKdesignInstance(traversedNode) || isLocalComponent) {
          // few components that have slots we need to check if the children are valid Kdesign instances
          if (
            !isLocalComponent &&
            // slot holders can be variants (matched via the parent set) or standalone
            // components like _Modal Header (matched via their own key)
            (KDESIGN_COMPONENT_IDS_HAVING_SLOT.includes(
              (traversedNode.mainComponent?.parent as ComponentSetNode)?.key ?? '',
            ) ||
              KDESIGN_COMPONENT_IDS_HAVING_SLOT.includes(traversedNode.mainComponent?.key ?? ''))
          ) {
            // this will recursively follow the same process we follow.
            // check for Kdesign's instance and if there are certain components that has slot inside it then we recursively check inside them for kdesign components
            traversedNode.children.forEach((childNode) => {
              const slotComponentsCoverage = calculateCoverage(childNode);
              if (slotComponentsCoverage) {
                kdesignComponents += slotComponentsCoverage?.kdesignComponents;
                kdesignTextStyles += slotComponentsCoverage?.kdesignTextStyles;
                kdesignColorStyles += slotComponentsCoverage?.kdesignColorStyles;
                // patterns can be dropped into a slot too, so they have to roll up like the rest
                patternsUsed += slotComponentsCoverage?.patternsUsed;
                nonKdesignComponents += slotComponentsCoverage?.nonKdesignComponents;
                nonKdesignTextStyles += slotComponentsCoverage?.nonKdesignTextStyles;
                nonKdesignColorStyles += slotComponentsCoverage?.nonKdesignColorStyles;
                totalLayers += slotComponentsCoverage?.totalLayers;
              }
            });
          }
          if (!isLocalComponent && traversedNode.overrides.length) {
            // flag the instance if its overridden
            let isOverridden = false;
            traversedNode.overrides.forEach((node) => {
              if (
                // these are properties which tells us if the components' text has been overridden. Fill this with more cases going forward as there are more possible values
                // https://www.figma.com/plugin-docs/api/NodeChangeProperty/
                node.overriddenFields.includes('letterSpacing') ||
                node.overriddenFields.includes('textStyleId') ||
                node.overriddenFields.includes('fontName') ||
                node.overriddenFields.includes('fontSize') ||
                node.overriddenFields.includes('lineHeight') ||
                node.overriddenFields.includes('textCase')
              ) {
                isOverridden = true;
              }
              if (node.overriddenFields.includes('cornerRadius')) {
                isOverridden = true;
                const isCardBorderRadiusValid = [
                  traversedNode.boundVariables?.topLeftRadius?.id,
                  traversedNode.boundVariables?.topRightRadius?.id,
                  traversedNode.boundVariables?.bottomLeftRadius?.id,
                  traversedNode.boundVariables?.bottomRightRadius?.id,
                ].every((variableId) =>
                  Object.values(kdesignThemeData.variables.CardBorderRadius).includes(
                    variableId ?? '',
                  ),
                );
                if (
                  // (traversedNode.mainComponent?.parent as ComponentSetNode)?.key
                  (traversedNode.mainComponent?.parent as ComponentSetNode)?.key?.includes(
                    kdesignThemeData.components.Card.key,
                  ) &&
                  isCardBorderRadiusValid
                ) {
                  isOverridden = false;
                }
              }
            });
            if (isOverridden) {
              nonKdesignComponents++;
              highlightNonKdesignNode(
                traversedNode,
                'Overridden Kdesign Instance. Please reset changes',
              );
            } else {
              kdesignComponents++;
            }
          } else if (!isLocalComponent) {
            kdesignComponents++;
          }

          // we want to ignore the count of all the COMPONENT and COMPONENT_SET node types from the total layer count
          if (!isLocalComponent) {
            totalLayers++;
          }
        }
        // else if (traversedNode.type === 'INSTANCE') {
        //   nonKdesignComponents++;
        //   highlightNonKdesignNode(traversedNode, 'Instance is not a Kdesign Instance');
        // }
        else if (traversedNode.type === 'TEXT') {
          // check if the text is using Kdesign's text styles
          let isMixedTextStyleOfKdesign = false;
          let traversedNodeTextStyleId = '';
          let isTextRangeFillsOfKdesign = false;
          let traversedNodeColorVariableId = '';

          /**
           * The textSyleId can have figma.mixed. so in that case we need to go character by character
           * and do getRangeTextStyleId(charIndex,charIndex+1) instead of textStyleId
           */
          if (traversedNode?.textStyleId === figma.mixed) {
            isMixedTextStyleOfKdesign = traversedNode.characters
              .split('')
              .every((character, index) => {
                if (/\s/.test(character)) {
                  return true;
                }
                return KDESIGN_TEXT_TYPEFACE_STYLE_IDS.includes(
                  (traversedNode.getRangeTextStyleId(index, index + 1) as string).split(',')[0],
                );
              });

            if (isMixedTextStyleOfKdesign) {
              kdesignTextStyles++;
            } else {
              nonKdesignTextStyles++;
              highlightNonKdesignNode(traversedNode, 'Text is not using Kdesign');
            }
          } else {
            traversedNodeTextStyleId = traversedNode?.textStyleId?.split(',')[0];
            if (KDESIGN_TEXT_TYPEFACE_STYLE_IDS.includes(traversedNodeTextStyleId ?? '')) {
              kdesignTextStyles++;
            } else {
              nonKdesignTextStyles++;
              highlightNonKdesignNode(traversedNode, 'Text Style is not from Kdesign');
            }
          }

          // check if text is using kdesign color styles
          if (traversedNode.boundVariables?.fills?.length) {
            traversedNodeColorVariableId = traversedNode.boundVariables.fills[0].id.split('/')[0];
            if (KDESIGN_TEXT_COLOR_STYLE_IDS.includes(traversedNodeColorVariableId ?? '')) {
              kdesignColorStyles++;
            } else {
              nonKdesignColorStyles++;
              highlightNonKdesignNode(
                traversedNode,
                'Text Color Style should only use surface/text or feedback/text tokens',
              );
            }
          } else {
            nonKdesignColorStyles++;
            highlightNonKdesignNode(traversedNode, 'Text Color Style is not using Kdesign Tokens');
          }

          // check if text is using kdesign text styles
          // textRangeFills is used when the text has different colors for different characters
          if (traversedNode.boundVariables?.textRangeFills?.length) {
            isTextRangeFillsOfKdesign = traversedNode.boundVariables.textRangeFills.every((fill) => {
              if (KDESIGN_TEXT_COLOR_STYLE_IDS.includes(fill.id.split('/')[0])) {
                return true;
              }
              return false;
            });
            if (isTextRangeFillsOfKdesign) {
              kdesignTextStyles++;
            } else {
              nonKdesignTextStyles++;
              highlightNonKdesignNode(
                traversedNode,
                'Text Color Style should only use surface/text or feedback/text tokens',
              );
            }
          }

          if (
            traversedNode.boundVariables &&
            Object.keys(traversedNode.boundVariables).length === 0
          ) {
            nonKdesignTextStyles++;
            highlightNonKdesignNode(
              traversedNode,
              'Text Color Style should only use surface/text or feedback/text tokens',
            );
          }

          // this check is for typography components, if the typography uses color and text both from kdesign styles then they are typography kdesign components
          if (
            (isMixedTextStyleOfKdesign ||
              KDESIGN_TEXT_TYPEFACE_STYLE_IDS.includes(traversedNodeTextStyleId)) &&
            (isTextRangeFillsOfKdesign ||
              KDESIGN_TEXT_COLOR_STYLE_IDS.includes(traversedNodeColorVariableId))
          ) {
            kdesignComponents++;
          }
        } else if (traversedNode.type === 'LINE') {
          nonKdesignComponents++;
          highlightNonKdesignNode(traversedNode, 'Use a Divider Component Instead');
        } else if (traversedNode.type === 'RECTANGLE') {
          let isImage = false;

          if (traversedNode.fills !== figma.mixed) {
            // figma considers images as rectangles with fill type as IMAGE
            isImage = Boolean(traversedNode.fills.find((fill) => fill.type === 'IMAGE'));
          }

          if (isImage) {
            NODES_SKIP_FROM_COVERAGE.push('RECTANGLE');
          }

          const hasEffects = traversedNode.effects?.length;
          const hasKdesignEffectStyles = KDESIGN_EFFECT_STYLE_IDS.includes(traversedNode.effectStyleId);

          if (hasEffects && hasKdesignEffectStyles) {
            // kdesignEffectStyles++;
          } else if (hasEffects && !hasKdesignEffectStyles) {
            // nonKdesignEffectStyles++;
            highlightNonKdesignNode(traversedNode, `Effects not from Kdesign's elevation styles`);
          }

          // replace with variables
          const hasFillsVariable = traversedNode.boundVariables?.fills?.length;
          const hasStrokesVariable = traversedNode.boundVariables?.strokes?.length;
          if (!isImage && (hasFillsVariable || hasStrokesVariable)) {
            // check if rectangle uses kdesign surface.border.* colors for border
            if (hasStrokesVariable) {
              const traversedNodeColorVariableId = traversedNode.boundVariables.strokes[0].id.split(
                '/',
              )[0];
              if (
                KDESIGN_BOX_BORDER_COLOR_VARIABLE_IDS.includes(traversedNodeColorVariableId ?? '')
              ) {
                kdesignColorStyles++;
              } else {
                nonKdesignColorStyles++;
                highlightNonKdesignNode(
                  traversedNode,
                  'Box Border color should only use surface/border/* tokens',
                );
              }
            }
            // check if rectangle is using kdesign surface.background.* tokens for background
            if (hasFillsVariable) {
              const traversedNodeFillStyleId = traversedNode.boundVariables.fills[0].id.split(
                '/',
              )[0];
              if (
                KDESIGN_BOX_BACKGROUND_COLOR_VARIABLE_IDS.includes(traversedNodeFillStyleId ?? '')
              ) {
                kdesignColorStyles++;
              } else {
                nonKdesignColorStyles++;
                highlightNonKdesignNode(
                  traversedNode,
                  'Box Background color should only use surface/background/* tokens',
                );
              }
            }
          } else if (!isImage) {
            highlightNonKdesignNode(traversedNode, 'Box not adhering to Kdesign guidelines');
          }
        }

        const ignoreInstanceFrameNodeNames = [
          'root',
          'wrapper',
          'bottom-sheet-container',
          'accordion-header container',
          'overlay', // Drawer Overlay
          'Marker', // Step Marker
          'Summary Row',
          'card-body',
          'card-content-holder',
        ];

        // a Kdesign component's own internal frames are not the designer's responsibility, so they
        // are neither flagged nor counted as layers
        const isKdesignInternalFrame =
          traversedNode.type === 'FRAME' && isInsideKdesignComponent(traversedNode);

        /** check if a frame/custom instance created using frame is being used as a custom component
         * has fills?
         * has strokes?
         * has effects?
         * if any of the above is true then it's a custom component
         * */
        if (
          (traversedNode.type === 'FRAME' ||
            (traversedNode.type === 'INSTANCE' && !isKdesignInstance(traversedNode))) &&
          !isKdesignInternalFrame &&
          !isPatternExemptFrameNode &&
          !ignoreInstanceFrameNodeNames.includes(traversedNode.name) &&
          getParentNode(traversedNode)?.type !== 'PAGE' &&
          getParentNode(traversedNode)?.type !== 'SECTION'
        ) {
          const hasStrokes =
            traversedNode?.boundVariables?.strokes?.length ??
            traversedNode.strokes.filter((stroke) => stroke.visible !== false).length; // remove the hidden strokes from traversing
          const hasEffects = traversedNode.effects?.length || traversedNode.effectStyleId;
          const hasNonMixedFills =
            traversedNode.fills !== figma.mixed &&
            traversedNode.fills.filter((fill) => fill.visible !== false).length; // remove the hidden fills from traversing
          const hasFills =
            traversedNode?.boundVariables?.fills?.length ??
            hasNonMixedFills ??
            traversedNode.fillStyleId;
          if (
            Boolean(hasStrokes || hasEffects || hasFills) &&
            !Boolean(traversedNode.fills === figma.mixed)
          ) {
            // this is non-kdesign component error
            // push the frame layer to be included in component count
            nonKdesignComponents++;
            highlightNonKdesignNode(
              traversedNode,
              `You might want to use Card with Slot. You're using a Frame with fill/strokes/effects.`,
            );
          } else {
            NODES_SKIP_FROM_COVERAGE.push('FRAME');
          }
        }

        if (
          ![...NODES_SKIP_FROM_COVERAGE, 'TEXT', 'LINE', 'RECTANGLE', 'FRAME'].includes(
            traversedNode.type,
          ) &&
          getParentNode(traversedNode)?.type !== 'PAGE'
        ) {
          highlightNonKdesignNode(traversedNode, 'Not created using Kdesign Components/Tokens');
        }

        if (
          getParentNode(traversedNode)?.type !== 'PAGE' &&
          getParentNode(traversedNode)?.type !== 'SECTION' &&
          !NODES_SKIP_FROM_COVERAGE.includes(traversedNode.type) &&
          !isKdesignInternalFrame &&
          !isPatternExemptFrameNode &&
          // if the frame instances are from Kdesign's components then we don't want to include them in the count because these are components with slots
          !ignoreInstanceFrameNodeNames.includes(traversedNode.name)
        ) {
          // exclude the main frame itself from the count to remove false negatives
          totalLayers++;
        }

        // remove rectangle node index for next iteration because we don't want to remove all the rectangle nodes, only the image ones
        // remove frame node index for next iteration because we don't want to remove layout frame nodes, only the one that has being used as card
        const nodesToBeRemoved = ['RECTANGLE', 'FRAME'];
        // const nodesToBeRemoved = ['RECTANGLE'];
        nodesToBeRemoved.forEach((nodeName) => {
          const nodeIndex = NODES_SKIP_FROM_COVERAGE.findIndex((node) => node === nodeName);
          if (nodeIndex !== -1) {
            NODES_SKIP_FROM_COVERAGE.splice(nodeIndex, 1);
          }
        });
      },
      (traversedNode) => {
        // callback to stopTraversal for children of a node
        // true: we shall stop
        // false: we shall keep traversing children
        if (!traversedNode.visible) {
          return true;
        }

        if (isKdesignInstance(traversedNode)) {
          // we shall stop traversal further if we have found that an instance is Kdesign instance
          // if we keep traversing then chances are the metrics will be skewed because Kdesign components are composed of non-kdesign themselves
          // in code analytics we can add "data-*" to all the children till leaf nodes but over here we can't hence we stop
          return true;
        }
        return false;
      },
    );
  } catch (error: unknown) {
    console.error(error);
    figma.notify('⚠️ Error in rendering coverage card. Please try again');
    figma.closePlugin();
  }

  if (kdesignComponents === 0 && totalLayers === 0) {
    kdesignCoverage = 0;
  } else if (kdesignComponents <= 0) {
    kdesignCoverage = 0;
  } else if (nonKdesignComponents === 0 && nonKdesignTextStyles === 0 && nonKdesignColorStyles === 0) {
    // we need to do this because when everything is from kdesign there could still be outer frames and things like that are non-kdesign and not flagged as well
    kdesignCoverage = 100;
  } else {
    kdesignCoverage = Number(
      (kdesignComponents / (totalLayers + nonKdesignTextStyles + nonKdesignColorStyles)) * 100,
    );
  }

  return {
    kdesignComponents,
    kdesignTextStyles,
    kdesignColorStyles,
    patternsUsed,
    nonKdesignComponents,
    nonKdesignTextStyles,
    nonKdesignColorStyles,
    totalLayers,
    kdesignCoverage,
  };
};

const getPageMainFrameNodes = (nodes: readonly SceneNode[]): SceneNode[] => {
  const mainFrameNodes: SceneNode[] = [];
  try {
    for (const node of nodes) {
      if (getParentNode(node)?.type === 'PAGE') {
        // if selection is top level frame then start the coverage count
        // await calculateCoverage(node);
        mainFrameNodes.push(node);
      } else {
        // if the selection is not the top level frame then traverse up till we find the frame and then start the coverage count
        // await calculateCoverage(mainFrameNode);
        mainFrameNodes.push(traverseUpTillMainFrame(node) as SceneNode);
      }
    }
  } catch (error: unknown) {
    console.error(error);
    figma.notify('⚠️ Error in identifying main frame node. Please try again');
    figma.closePlugin();
  }

  return mainFrameNodes;
};

const removeOldGroupNodes = (): void => {
  // remove all teh old group nodes
  const kdesignCoverageCardsGroup = figma.currentPage.findOne(
    (node) => node.name === 'Kdesign Coverage Cards',
  );
  const nonKdesignItemsGroup = figma.currentPage.findOne((node) => node.name === 'Non Kdesign Items');

  if (kdesignCoverageCardsGroup) {
    kdesignCoverageCardsGroup.remove();
  }
  if (nonKdesignItemsGroup) {
    nonKdesignItemsGroup.remove();
  }
};

const main = async (): Promise<void> => {
  try {
    figma.skipInvisibleInstanceChildren = true;
    figma.notify('Calculating Coverage', { timeout: Infinity });

    removeOldGroupNodes();

    let nodes: readonly SceneNode[] = [];
    if (figma.currentPage.selection.length > 0) {
      // you already have the selection, run the plugin
      nodes = figma.currentPage.selection;
    } else if (figma.currentPage.type === 'PAGE') {
      // plugin is run from page scope but has no selection, so traverse all the nodes and then measure coverage
      nodes = getSelectedNodesOrAllNodes();
    } else {
      // the plugin is not run from a page scope, throw error
      figma.notify(
        '⚠️ Please run the plugin by opening a Page or selecting a layer inside a Page',
        {
          error: true,
        },
      );
      figma.closePlugin();
    }

    if (nodes.length) {
      // 1. get the main frame nodes of the current page(ignoring non-frame nodes)
      const mainFrameNodes = getPageMainFrameNodes(nodes);
      for await (const mainFrameNode of mainFrameNodes) {
        // 2. calculate the coverage
        const coverageMetrics = calculateCoverage(mainFrameNode);
        if (coverageMetrics) {
          // 3. render the coverage card. fin.
          await renderCoverageCard({ mainFrameNode, ...coverageMetrics });
          // 4. send data to analytics service
          await sendAnalytics({
            eventName: 'Kdesign Coverage Plugin Used',
            properties: {
              fileName: figma.root.name,
              pageName: figma.currentPage.name,
              pagePath: `${figma.root.name}/${figma.currentPage.name}`,
              nodeName: mainFrameNode.name,
              nodePath: `${figma.root.name}/${figma.currentPage.name}/${mainFrameNode.name}`,
              nodeUrlPath: `https://www.figma.com/file/${figma.fileKey}/${
                figma.root.name
              }?node-id=${encodeURIComponent(mainFrameNode.id)}`,
              nodetype: mainFrameNode.type,
              isMarkedReadyForDev:
                mainFrameNode.type === 'SECTION'
                  ? mainFrameNode.devStatus?.type === 'READY_FOR_DEV'
                  : 'not-a-section-node',
              nodeWidth: mainFrameNode.width,
              nodeHeight: mainFrameNode.height,
              ...coverageMetrics,
            },
          });
        }
      }

      if (nonKdesignHighlighterNodes.length) {
        const nonKdesignHighterNodesGroup = figma.group(nonKdesignHighlighterNodes, figma.currentPage);
        nonKdesignHighterNodesGroup.name = 'Non Kdesign Items';
        nonKdesignHighterNodesGroup.expanded = false;
      }

      if (kdesignCoverageCards.length) {
        const kdesignCoverageCardsGroup = figma.group(kdesignCoverageCards, figma.currentPage);
        kdesignCoverageCardsGroup.name = 'Kdesign Coverage Cards';
        kdesignCoverageCardsGroup.expanded = false;
      }
    }
  } catch (error: unknown) {
    console.error(error);
    figma.notify('⚠️ Something went wrong. Please try re-running the plugin');
  } finally {
    figma.closePlugin();
  }
};

export default main;
