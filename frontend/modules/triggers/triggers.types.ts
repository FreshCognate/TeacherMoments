export type ConditionPrompt = {
  ref: string,
  options?: string[],
  text?: string
};

export type Condition = {
  _id?: string,
  prompts?: ConditionPrompt[]
};

export type StemItem = {
  elementRef: string,
  conditions: Condition[]
};

export type OnEditPromptConditionClicked = (args: { elementRef: string, prompt: any, condition: any }) => void;

export type OnRemoveConditionClicked = (args: { elementRef: string, conditionId?: string }) => void;
