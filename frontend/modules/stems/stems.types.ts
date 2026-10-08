import { ConditionPrompt } from '../triggers/triggers.types';

export type BranchingOptionCondition = {
  _id: string,
  prompts: ConditionPrompt[]
}

export type BranchingOption = {
  _id: string,
  elementRef: string,
  conditions: BranchingOptionCondition[],
  [languageBody: `${string}-body`]: any[],
  score: number,
}

export type StemBranchingItemCondition = {
  branchingOptionId: string,
  conditionId: string,
  text?: string,
  options?: string[],
  score: number,
  reasoning?: string
};

export type StemBranchingItem = {
  blockRef: string,
  blockType: string,
  stem: string | undefined,
  selectedOptions: string[],
  textValue: string,
  conditions: StemBranchingItemCondition[]
};

export type Stem = {
  _id: string,
  type: 'stem',
  ref: string,
  scenario: string,
  name: string,
  description: string,
  stemRef: string,
  slideRef: string,
  isRoot: boolean,
  branchingOptions: BranchingOption[],
  defaultBranchingStemRef: string;
  sortOrder: number,
  createdAt: Date,
  createdBy: string,
  updatedAt: Date,
  updatedBy: string,
  isDeleted: boolean,
  deletedAt: Date,
  deletedBy: string
}