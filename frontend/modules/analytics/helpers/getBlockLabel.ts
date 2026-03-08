import { BlockColumn } from '../analytics.types';

export default function getBlockLabel(blockColumn: BlockColumn): string {
  const name = blockColumn.name || blockColumn.ref || `Block ${blockColumn.sortOrder + 1}`;
  return blockColumn.slideName ? `${blockColumn.slideName} - ${name}` : name;
}
