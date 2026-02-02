import Joi from 'joi';
import hasPermissions from '#core/authentication/middleware/hasPermissions.js';
import isAuthenticated from '#core/authentication/middleware/isAuthenticated.js';
import controller from './play.controller.js';
import playSlidesController from './playSlides.controller.js';
import playBlocksController from './playBlocks.controller.js'
import playTriggersController from './playTriggers.controller.js'
import playRunsController from './playRuns.controller.js'

export default [{
  route: '/play/slides',
  controller: playSlidesController,
  all: {
    query: {
      scenario: Joi.string().required()
    },
    middleware: [isAuthenticated]
  },
}, {
  route: '/play/blocks',
  controller: playBlocksController,
  all: {
    query: {
      scenario: Joi.string().required()
    },
    middleware: [isAuthenticated]
  },
}, {
  route: '/play/triggers',
  controller: playTriggersController,
  all: {
    query: {
      scenario: Joi.string().required()
    },
    middleware: [isAuthenticated]
  },
}, {
  route: '/play/runs',
  controller: playRunsController,
  all: {
    query: {
      cohort: Joi.string().required()
    },
    middleware: [isAuthenticated]
  },
  read: {
    param: 'id',
    query: {
      cohort: Joi.string(),
    },
    middleware: [isAuthenticated]
  },
  update: {
    param: 'id',
    body: {
      activeSlideRef: Joi.string(),
      isArchived: Joi.boolean(),
      isComplete: Joi.boolean(),
      isConsentAcknowledged: Joi.boolean(),
      hasGivenConsent: Joi.boolean(),
      stages: Joi.array().items({
        blocksByRef: Joi.object().pattern(/./, Joi.object({
          audio: Joi.alternatives().try(Joi.object(), Joi.string(), null),
          isAbleToComplete: Joi.boolean(),
          isComplete: Joi.boolean(),
          textValue: Joi.string().allow(''),
          selectedOptions: Joi.array().items(Joi.string())
        })),
        isComplete: Joi.boolean(),
        isSubmitted: Joi.boolean(),
        slideRef: Joi.string(),
        feedbackItems: Joi.array(),
        shouldStopNavigation: Joi.boolean(),
        triggersByRef: Joi.object(),
        status: Joi.string().allow(null)
      }),
    },
    query: {
      cohort: Joi.string(),
    },
    middleware: [isAuthenticated]
  }
}, {
  route: '/play',
  controller,
  read: {
    param: 'id',
    middleware: [isAuthenticated],
  },
}];