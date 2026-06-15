import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';

vi.mock('~/core/cache/containers/withCache', () => ({
  default: (Component) => Component
}));

vi.mock('~/core/app/components/withRouter', () => ({
  default: (Component) => Component
}));

const updateRunMock = vi.fn();
const navigateToMock = vi.fn();
const navigateBackMock = vi.fn();
const navigateToNextSlideMock = vi.fn();
const getSlideNavigationDetailsMock = vi.fn();
const setSlideToCompleteMock = vi.fn();
const setScenarioConsentMock = vi.fn();
const getNextSlideMock = vi.fn();
const setScenarioToCompleteMock = vi.fn();
const setScenarioToArchivedMock = vi.fn();
const setSlideToSubmittedMock = vi.fn();
const setShouldStopNavigationMock = vi.fn();
const getCurrentStageMock = vi.fn();
const ensureCurrentStageMock = vi.fn();
const getActiveSlideStemsMock = vi.fn();
const getTriggerMock = vi.fn();
const getTriggerErrorsMock = vi.fn();
const getTriggersBySlideRefMock = vi.fn();
const isScenarioInPlayMock = vi.fn();
const getCohortFromSearchParamsMock = vi.fn();
const addModalMock = vi.fn();
const getCacheMock = vi.fn();

vi.mock('~/modules/run/helpers/updateRun', () => ({ default: (args) => updateRunMock(args) }));
vi.mock('~/modules/run/helpers/navigateTo', () => ({ default: (args) => navigateToMock(args) }));
vi.mock('~/modules/run/helpers/navigateBack', () => ({ default: (args) => navigateBackMock(args) }));
vi.mock('~/modules/run/helpers/navigateToNextSlide', () => ({ default: (args) => navigateToNextSlideMock(args) }));
vi.mock('~/modules/run/helpers/getSlideNavigationDetails', () => ({ default: () => getSlideNavigationDetailsMock() }));
vi.mock('~/modules/run/helpers/setSlideToComplete', () => ({ default: (args) => setSlideToCompleteMock(args) }));
vi.mock('~/modules/run/helpers/setScenarioConsent', () => ({ default: (val) => setScenarioConsentMock(val) }));
vi.mock('~/modules/run/helpers/getNextSlide', () => ({ default: () => getNextSlideMock() }));
vi.mock('~/modules/run/helpers/setScenarioToComplete', () => ({ default: () => setScenarioToCompleteMock() }));
vi.mock('~/modules/run/helpers/setScenarioToArchived', () => ({ default: () => setScenarioToArchivedMock() }));
vi.mock('~/modules/run/helpers/setSlideToSubmitted', () => ({ default: () => setSlideToSubmittedMock() }));
vi.mock('~/modules/run/helpers/setShouldStopNavigation', () => ({ default: (val) => setShouldStopNavigationMock(val) }));
vi.mock('~/modules/run/helpers/getCurrentStage', () => ({ default: () => getCurrentStageMock() }));
vi.mock('~/modules/run/helpers/ensureCurrentStage', () => ({ default: () => ensureCurrentStageMock() }));
vi.mock('~/modules/triggers/helpers/getTrigger', () => ({ default: (action) => getTriggerMock(action) }));
vi.mock('~/modules/triggers/helpers/getTriggerErrors', () => ({ default: (trigger) => getTriggerErrorsMock(trigger) }));
vi.mock('~/modules/triggers/helpers/getTriggersBySlideRef', () => ({ default: (args) => getTriggersBySlideRefMock(args) }));
vi.mock('~/modules/scenarios/helpers/isScenarioInPlay', () => ({ default: () => isScenarioInPlayMock() }));
vi.mock('~/modules/cohorts/helpers/getCohortFromSearchParams', () => ({ default: (router) => getCohortFromSearchParamsMock(router) }));
vi.mock('~/core/dialogs/helpers/addModal', () => ({ default: (config, callback) => addModalMock(config, callback) }));
vi.mock('~/core/cache/helpers/getCache', () => ({ default: (key) => getCacheMock(key) }));
vi.mock('~/modules/slides/helpers/getActiveSlideStems', () => ({ default: (args) => getActiveSlideStemsMock(args) }));

let capturedProps = null;
vi.mock('../components/slidePlayer', () => ({
  default: (props) => {
    capturedProps = props;
    return <div data-testid="slide-player-stub" />;
  }
}));

import SlidePlayerContainer from '../containers/slidePlayerContainer';

const buildProps = (overrides = {}) => ({
  scenario: { _id: 'scenario-1' },
  activeSlide: { ref: 'slide-1', slideType: 'CONTENT' },
  activeBlocks: [],
  run: { data: { isComplete: false } },
  router: { params: {} },
  isPreview: false,
  ...overrides
});

const setNavigationDetails = (overrides = {}) => {
  getSlideNavigationDetailsMock.mockReturnValue({
    isAbleToCompleteSlide: false,
    hasRequiredPrompts: true,
    hasPrompts: false,
    isSubmitted: false,
    ...overrides
  });
};

describe('SlidePlayerContainer', () => {
  beforeEach(() => {
    capturedProps = null;
    vi.clearAllMocks();
    getCurrentStageMock.mockReturnValue({ shouldStopNavigation: false });
    ensureCurrentStageMock.mockReturnValue({ shouldStopNavigation: false });
    getActiveSlideStemsMock.mockReturnValue([]);
    setNavigationDetails();
    getNextSlideMock.mockReturnValue({ ref: 'next-slide' });
    getCohortFromSearchParamsMock.mockReturnValue(null);
  });

  describe('getNavigationDetails', () => {
    it('shows consent buttons on CONSENT slides', () => {
      render(<SlidePlayerContainer {...buildProps({ activeSlide: { ref: 'consent', slideType: 'CONSENT' } })} />);
      expect(capturedProps.primaryAction.action).toBe('CONSENT_ACCEPTED');
      expect(capturedProps.secondaryAction.action).toBe('CONSENT_DENIED');
    });

    it('shows NEXT/BACK when there is a next slide and no prompts', () => {
      setNavigationDetails({ hasPrompts: false });
      render(<SlidePlayerContainer {...buildProps()} />);
      expect(capturedProps.primaryAction.action).toBe('NEXT');
      expect(capturedProps.secondaryAction.action).toBe('BACK');
    });

    it('shows SUBMIT when there is a next slide, prompts exist, and slide is not submitted', () => {
      setNavigationDetails({ hasPrompts: true, isSubmitted: false });
      render(<SlidePlayerContainer {...buildProps()} />);
      expect(capturedProps.primaryAction.action).toBe('SUBMIT');
      expect(capturedProps.primaryAction.text).toBe('Submit');
    });

    it('shows COMPLETE_SCENARIO when there is no next slide, no prompts, and run is not complete', () => {
      getNextSlideMock.mockReturnValue(null);
      setNavigationDetails({ hasPrompts: false });
      render(<SlidePlayerContainer {...buildProps()} />);
      expect(capturedProps.primaryAction.action).toBe('COMPLETE_SCENARIO');
      expect(capturedProps.secondaryAction.action).toBe('BACK');
    });

    it('shows RERUN/RETURN actions when run is complete', () => {
      getNextSlideMock.mockReturnValue(null);
      render(<SlidePlayerContainer {...buildProps({ run: { data: { isComplete: true } } })} />);
      expect(capturedProps.primaryAction.action).toBe('RETURN_TO_SCENARIOS');
      expect(capturedProps.primaryAction.text).toBe('Return to scenarios');
      expect(capturedProps.secondaryAction.action).toBe('RERUN_SCENARIO');
    });

    it('uses "Return to cohort" text when run is complete and a cohort is in the URL', () => {
      getNextSlideMock.mockReturnValue(null);
      getCohortFromSearchParamsMock.mockReturnValue('cohort-1');
      render(<SlidePlayerContainer {...buildProps({ run: { data: { isComplete: true } } })} />);
      expect(capturedProps.primaryAction.text).toBe('Return to cohort');
    });

    it('shows SUBMIT on the last slide when there are unsubmitted prompts', () => {
      getNextSlideMock.mockReturnValue(null);
      setNavigationDetails({ hasPrompts: true, isSubmitted: false });
      render(<SlidePlayerContainer {...buildProps()} />);
      expect(capturedProps.primaryAction.action).toBe('SUBMIT');
    });
  });

  describe('render against every activeSlide shape getActiveSlide can return', () => {
    // These mirror playScenarioContainer.getActiveSlide(): it can return null
    // (no activeSlideRef), undefined (find misses), the ref-less CONSENT/SUMMARY
    // synthetic slides, or a real slide. The container must tolerate all of them.
    const cases = [
      { name: 'null (no active slide ref)', activeSlide: null, expectedRef: undefined },
      { name: 'undefined (active slide ref matched no slide)', activeSlide: undefined, expectedRef: undefined },
      { name: 'ref-less CONSENT synthetic slide', activeSlide: { _id: 'CONSENT_SLIDE', slideType: 'CONSENT' }, expectedRef: undefined },
      { name: 'ref-less SUMMARY synthetic slide', activeSlide: { _id: 'SUMMARY_SLIDE', slideType: 'SUMMARY' }, expectedRef: undefined },
      { name: 'a real slide', activeSlide: { ref: 'slide-1', slideType: 'CONTENT' }, expectedRef: 'slide-1' }
    ];

    cases.forEach(({ name, activeSlide, expectedRef }) => {
      it(`does not crash and resolves stems for ${name}`, () => {
        expect(() => {
          render(<SlidePlayerContainer {...buildProps({ activeSlide })} />);
        }).not.toThrow();
        expect(getActiveSlideStemsMock).toHaveBeenCalledWith({ activeSlideRef: expectedRef });
      });
    });
  });

  describe('onActionClicked', () => {
    it('CONSENT_ACCEPTED completes the consent slide, sets consent to true, and navigates next', () => {
      render(<SlidePlayerContainer {...buildProps()} />);
      capturedProps.onActionClicked('CONSENT_ACCEPTED');
      expect(setSlideToCompleteMock).toHaveBeenCalledWith({ slideRef: 'CONSENT' });
      expect(setScenarioConsentMock).toHaveBeenCalledWith(true);
      expect(navigateToNextSlideMock).toHaveBeenCalled();
    });

    it('CONSENT_DENIED sets consent to false and navigates next', () => {
      render(<SlidePlayerContainer {...buildProps()} />);
      capturedProps.onActionClicked('CONSENT_DENIED');
      expect(setScenarioConsentMock).toHaveBeenCalledWith(false);
      expect(navigateToNextSlideMock).toHaveBeenCalled();
    });

    it('BACK navigates back', () => {
      render(<SlidePlayerContainer {...buildProps()} />);
      capturedProps.onActionClicked('BACK');
      expect(navigateBackMock).toHaveBeenCalled();
    });

    it('NEXT marks the slide complete and moves on', () => {
      render(<SlidePlayerContainer {...buildProps({ activeSlide: { ref: 'slide-1', slideType: 'CONTENT' } })} />);
      capturedProps.onActionClicked('NEXT');
      expect(setSlideToCompleteMock).toHaveBeenCalledWith({ slideRef: 'slide-1' });
      expect(navigateToNextSlideMock).toHaveBeenCalled();
    });

    it('FINISH_SCENARIO archives the scenario', () => {
      setScenarioToArchivedMock.mockResolvedValue();
      render(<SlidePlayerContainer {...buildProps()} />);
      capturedProps.onActionClicked('FINISH_SCENARIO');
      expect(setScenarioToArchivedMock).toHaveBeenCalled();
    });

    it('COMPLETE_SCENARIO marks the slide complete and the scenario complete', () => {
      render(<SlidePlayerContainer {...buildProps({ activeSlide: { ref: 'slide-1', slideType: 'CONTENT' } })} />);
      capturedProps.onActionClicked('COMPLETE_SCENARIO');
      expect(setSlideToCompleteMock).toHaveBeenCalledWith({ slideRef: 'slide-1' });
      expect(setScenarioToCompleteMock).toHaveBeenCalled();
    });

    it('RETURN_TO_SCENARIOS navigates to /scenarios when there is no cohort', () => {
      const router = { navigate: vi.fn(), params: {} };
      render(<SlidePlayerContainer {...buildProps({ router })} />);
      capturedProps.onActionClicked('RETURN_TO_SCENARIOS');
      expect(router.navigate).toHaveBeenCalledWith('/scenarios');
    });

    it('RETURN_TO_SCENARIOS navigates to the cohort overview when a cohort is set', () => {
      const router = { navigate: vi.fn(), params: {} };
      getCohortFromSearchParamsMock.mockReturnValue('cohort-9');
      render(<SlidePlayerContainer {...buildProps({ router })} />);
      capturedProps.onActionClicked('RETURN_TO_SCENARIOS');
      expect(router.navigate).toHaveBeenCalledWith('/cohorts/cohort-9/overview');
    });

    it('RERUN_SCENARIO replaces the run cache and navigates to consent when scenario is not in play', () => {
      isScenarioInPlayMock.mockReturnValue(false);
      const setMock = vi.fn();
      getCacheMock.mockReturnValue({ set: setMock });

      render(<SlidePlayerContainer {...buildProps()} />);
      capturedProps.onActionClicked('RERUN_SCENARIO');

      expect(getCacheMock).toHaveBeenCalledWith('run');
      expect(setMock).toHaveBeenCalledWith({}, { setType: 'replace' });
      expect(navigateToMock).toHaveBeenCalledWith(expect.objectContaining({ slideRef: 'CONSENT' }));
    });
  });

  describe('onMenuActionClicked', () => {
    it('opens an end-scenario confirmation modal when END_SCENARIO_RUN is clicked', () => {
      render(<SlidePlayerContainer {...buildProps()} />);
      capturedProps.onMenuActionClicked('END_SCENARIO_RUN');
      expect(addModalMock).toHaveBeenCalled();
      expect(addModalMock.mock.calls[0][0].title).toBe('End this scenario?');
    });

    it('finishes the scenario and navigates when the user confirms YES', () => {
      vi.useFakeTimers();
      setScenarioToArchivedMock.mockResolvedValue();
      const router = { navigate: vi.fn(), params: {} };
      render(<SlidePlayerContainer {...buildProps({ router })} />);
      capturedProps.onMenuActionClicked('END_SCENARIO_RUN');

      const callback = addModalMock.mock.calls[0][1];
      callback('ACTION', { type: 'YES' });

      expect(setScenarioToArchivedMock).toHaveBeenCalled();

      vi.advanceTimersByTime(1000);
      expect(router.navigate).toHaveBeenCalledWith('/scenarios');
      vi.useRealTimers();
    });

    it('does not navigate when the user picks NO', () => {
      const router = { navigate: vi.fn(), params: {} };
      render(<SlidePlayerContainer {...buildProps({ router })} />);
      capturedProps.onMenuActionClicked('END_SCENARIO_RUN');

      const callback = addModalMock.mock.calls[0][1];
      callback('ACTION', { type: 'NO' });

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('menu state', () => {
    it('toggles isMenuOpen', () => {
      render(<SlidePlayerContainer {...buildProps()} />);
      expect(capturedProps.isMenuOpen).toBe(false);

      act(() => capturedProps.onMenuClicked(true));
      expect(capturedProps.isMenuOpen).toBe(true);

      act(() => capturedProps.onMenuClicked(false));
      expect(capturedProps.isMenuOpen).toBe(false);
    });
  });

  describe('onUpdateBlockTracking', () => {
    it('calls updateRun with the slideRef, blockRef, and update payload', async () => {
      updateRunMock.mockResolvedValue();
      render(<SlidePlayerContainer {...buildProps({ activeSlide: { ref: 'slide-1', slideType: 'CONTENT' } })} />);

      await capturedProps.onUpdateBlockTracking({ blockRef: 'block-1', update: { value: 'hi' } });

      expect(updateRunMock).toHaveBeenCalledWith({
        slideRef: 'slide-1',
        blockRef: 'block-1',
        update: { value: 'hi' }
      });
    });
  });
});
