export interface BlockResponse {
  ref: string;
  slideRef: string;
  name?: string;
  blockType: string;
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
  user?: any;
  scenario?: any;
  scenarioId?: string;
  hasStarted?: boolean;
  isComplete?: boolean;
  hasBeenCompleted?: boolean;
  previousRunsCount?: number;
  blockResponses?: BlockResponse[];
}
