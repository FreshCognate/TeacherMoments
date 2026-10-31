import { ConditionPrompt } from '../slides/slides.types';

export type BranchingOptionCondition = {
  _id: string,
  prompts: ConditionPrompt[]
}

export type BranchingOption = {
  _id: string,
  stemRef: string,
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

export type Condition = {
  _id?: string,
  prompts?: ConditionPrompt[]
};

export type StemItem = {
  stemRef: string,
  conditions: Condition[]
};

export type OnEditPromptConditionClicked = (args: { stemRef: string, prompt: any, condition: any }) => void;

export type OnRemoveConditionClicked = (args: { stemRef: string, conditionId?: string }) => void;