export interface BlockResponse {
  ref: string;
  slideRef: string;
  name?: string;
  blockType: string;
  inputType?: string;
  mediaType?: string;
  suggestionType?: string;
  slideName?: string;
  slideSortOrder: number;
  sortOrder: number;
  selectedOptions?: string[];
  textValue?: string;
  audio?: {
    transcript?: string;
  };
}

export interface BlockColumn {
  ref: string;
  slideRef: string;
  slideName?: string;
  slideSortOrder: number;
  name?: string;
  blockType: string;
  inputType?: string;
  sortOrder: number;
}

export interface StageResponse {
  slideRef: string;
  timeSpentMs?: number;
  feedbackItems?: string[];
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
  totalTimeSpentMs?: number;
  stages?: StageResponse[];
}
