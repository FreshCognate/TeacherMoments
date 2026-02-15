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

export interface UserResponse {
  username?: string;
  role?: string;
  hasStarted?: boolean;
  isComplete?: boolean;
  hasBeenCompleted?: boolean;
  previousRunsCount?: number;
  blockResponses?: BlockResponse[];
}
