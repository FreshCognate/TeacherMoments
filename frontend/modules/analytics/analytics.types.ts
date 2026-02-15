export interface BlockResponse {
  ref?: string;
  blockType?: string;
  inputType?: string;
  mediaType?: string;
  suggestionType?: string;
  slideName?: string;
  sortOrder: number;
  selectedOptions?: string[];
  textValue?: string;
  audio?: {
    transcript?: string;
  };
}

export type AnalyticsViewType = 'byScenarioUsers' | 'byUserScenarios';

export interface UserResponse {
  username?: string;
  scenarioName?: string;
  role?: string;
  hasStarted?: boolean;
  isComplete?: boolean;
  hasBeenCompleted?: boolean;
  previousRunsCount?: number;
  blockResponses?: BlockResponse[];
}
