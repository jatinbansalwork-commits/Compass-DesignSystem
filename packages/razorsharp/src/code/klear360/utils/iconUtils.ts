import { BLADE_ICONS } from '../constants/icons';
import type { Klear360ComponentInstanceNode } from '~/code/types/Klear360';

const capitalizeFirstLetter = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

/**
 * Convert icon names from figma to icon names used by Klear360 in code
 * eg - alert-triangle -> AlertTriangleIcon
 * @param instanceName figma name of the icon
 * @returns converted name
 */
export const convertFigmaIconNameToKlear360IconName = (figmaName: string): string =>
  `${figmaName
    .split('-')
    .map(capitalizeFirstLetter)
    .reduce((acc, current) => acc + current, '')}Icon`;

/**
 * Check if an icon name is present in Figma
 * eg - alert-triangle -> AlertTriangleIcon
 * @param instanceName figma name of the icon
 * @returns whether name is a blade icon name
 */
export const isIconName = (instanceName: string): boolean => {
  const convertedName = convertFigmaIconNameToKlear360IconName(instanceName);

  return BLADE_ICONS.includes(convertedName);
};

export const isIconInstance = (bladeNode: Klear360ComponentInstanceNode): boolean => {
  const instanceName = bladeNode.name;
  if (!instanceName) {
    return false;
  }
  return isIconName(instanceName) && Object.keys(bladeNode.componentProperties).length === 0;
};
