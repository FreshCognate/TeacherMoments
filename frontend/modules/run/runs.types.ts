export type StageFeedbackItemCondition = {
  conditionId: string,
  feedbackItemId: string,
  score: number,
  reasoning?: string
}

export type StageFeedbackItem = {
  blockRef: string,
  blockType: string,
  conditions: StageFeedbackItemCondition[]
}

export type Run = {
  _id: string
  isComplete: boolean
}