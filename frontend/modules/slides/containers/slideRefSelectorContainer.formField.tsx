import React, { Component } from 'react';
import SlideRefSelector from '../components/slideRefSelector.formField';
import registerField from '~/core/forms/helpers/registerField';
import WithCache from '~/core/cache/containers/withCache';
import each from 'lodash/each';
import find from 'lodash/find';
import { Slide } from '../slides.types';

interface SlideRefSelectorContainerProps {
  value: string,
  slides: { data: Slide[] },
  block: { data: { slideRef: string } },
  updateField: (value: string) => void
}

interface SlideRefSelectorContainerState {
  searchValue: string,
  isDropdownOpen: boolean
}

class SlideRefSelectorContainer extends Component<SlideRefSelectorContainerProps, SlideRefSelectorContainerState> {

  state = {
    searchValue: '',
    isDropdownOpen: false
  }

  getAvailableSlidesOptions = () => {
    const options: { value: string, text: string }[] = [];
    each(this.props.slides.data, (slide) => {
      if (slide.ref !== this.props.block.data.slideRef) {
        if (slide.name.toLowerCase().includes(this.state.searchValue.toLowerCase())) {
          options.push({ value: slide.ref, text: slide.name });
        }
      }
    });
    return options;
  }

  getValue = (): { selectedSlideRef?: string, selectedSlideName?: string } => {
    const slide = find(this.props.slides.data, { ref: this.props.value });
    if (!slide) {
      return {};
    }
    return {
      selectedSlideRef: slide.ref,
      selectedSlideName: slide.name
    }
  }

  onToggleDropdown = (isDropdownOpen: boolean) => {
    this.setState({ isDropdownOpen });
  }

  onSlideSelected = (slideRef: string) => {
    this.setState({ isDropdownOpen: false });
    this.props.updateField(slideRef);
  }

  onSearchInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchValue: event.target.value })
  }

  render() {
    const { selectedSlideRef, selectedSlideName } = this.getValue();
    return (
      <SlideRefSelector
        selectedSlideRef={selectedSlideRef}
        selectedSlideName={selectedSlideName}
        options={this.getAvailableSlidesOptions()}
        searchValue={this.state.searchValue}
        isDropdownOpen={this.state.isDropdownOpen}
        onToggleDropdown={this.onToggleDropdown}
        onSlideSelected={this.onSlideSelected}
        onSearchInputChanged={this.onSearchInputChanged}
      />
    );
  }
};

registerField('SlideRefSelector', WithCache(SlideRefSelectorContainer, {}, ['slides', 'block']));
export default SlideRefSelectorContainer;