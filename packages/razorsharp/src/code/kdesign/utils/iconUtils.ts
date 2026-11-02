import { KDESIGN_ICONS } from '../constants/icons';
import type { KdesignComponentInstanceNode } from '~/code/types/Kdesign';

const capitalizeFirstLetter = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

/**
 * Convert icon names from figma to icon names used by Kdesign in code
 * eg - alert-triangle -> AlertTriangleIcon
 * @param instanceName figma name of the icon
 * @returns converted name
 */
export const convertFigmaIconNameToKdesignIconName = (figmaName: string): string =>
  `${figmaName
    .split('-')
    .map(capitalizeFirstLetter)
    .reduce((acc, current) => acc + current, '')}Icon`;

/**
 * Check if an icon name is present in Figma
 * eg - alert-triangle -> AlertTriangleIcon
 * @param instanceName figma name of the icon
 * @returns whether name is a kdesign icon name
 */
export const isIconName = (instanceName: string): boolean => {
  const convertedName = convertFigmaIconNameToKdesignIconName(instanceName);

  return KDESIGN_ICONS.includes(convertedName);
};

export const isIconInstance = (kdesignNode: KdesignComponentInstanceNode): boolean => {
  const instanceName = kdesignNode.name;
  if (!instanceName) {
    return false;
  }
  return isIconName(instanceName) && Object.keys(kdesignNode.componentProperties).length === 0;
};
