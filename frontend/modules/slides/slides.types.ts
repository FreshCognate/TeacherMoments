import { Condition } from '../triggers/triggers.types';

export type FeedbackItem = {
  _id: string,
  elementRef: string,
  conditions: Condition[],
  [languageBody: `${string}-body`]: any[]
}

export type Slide = {
  _id: string,
  type: 'slide',
  ref: string,
  scenario: string,
  originalRef: string,
  originalScenario: string,
  name: string,
  slideType: 'STEP' | 'SUMMARY',
  sortOrder: number,
  stemRef: string,
  tags: string[],
  isLocked: boolean,
  lockedAt: Date,
  lockedBy: string,
  hasDiscussion: boolean,
  hasFeedback: boolean,
  shouldGenerateFeedbackFromAI: boolean,
  feedbackItems: FeedbackItem[],
  createdAt: Date,
  createdBy: string,
  updatedAt: Date,
  updatedBy: string,
  isDeleted: boolean,
  deletedAt: Date,
  deletedBy: string
}

export type StaticSlide = {
  _id: 'CONSENT_SLIDE' | 'SUMMARY_SLIDE',
  slideType: 'CONSENT' | 'SUMMARY',
  ref?: string,
  name?: string
}

export type ActiveSlide = Slide | StaticSlide

export type SlideAction = {
  action: string,
  text: string,
  color?: string,
  isActive?: boolean,
  isDisabled?: boolean
}
