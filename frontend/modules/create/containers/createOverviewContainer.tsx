import React, { Component } from 'react';
import CreateOverview from '../components/createOverview';
import WithCache from '~/core/cache/containers/withCache';
import { Stem } from '~/modules/stems/stems.types';
import { Slide } from '~/modules/slides/slides.types';
import { Scenario } from '~/modules/scenarios/scenarios.types';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import filter from 'lodash/filter';
import map from 'lodash/map';
import each from 'lodash/each';
import { OverviewSlide, OverviewStem, PositionedStem, Edge } from '../create.types';
import WithRouter from '~/core/app/components/withRouter';
import getCache from '~/core/cache/helpers/getCache';

type Props = {
  scenario: { data: Scenario };
  stems: { data: Stem[] };
  slides: { data: Slide[] };
};

const GAP_X = 120;
const GAP_Y = 120;
const STEM_HEIGHT = 52;

class CreateOverviewContainer extends Component<Props> {

  nextY = 0;
  maxWidth = 0;
  maxHeight = 0;
  edges: Edge[] = [];

  getTree = (): OverviewStem | null => {
    const rootStem = find(this.props.stems.data, { isRoot: true });

    if (!rootStem) return null;

    const buildStem = (stem: Stem): OverviewStem => {
      const childStems = filter(this.props.stems.data, { stemRef: stem.ref });

      const positions: number[] = [];
      let currentStem = stem;
      let parentStem = find(this.props.stems.data, { ref: currentStem.stemRef });

      while (parentStem) {
        const siblingStems = filter(this.props.stems.data, { stemRef: parentStem.ref });
        positions.unshift(findIndex(siblingStems, { _id: currentStem._id }) + 1);
        currentStem = parentStem;
        parentStem = find(this.props.stems.data, { ref: currentStem.stemRef });
      }

      const label = positions.length === 0
        ? 'A'
        : map(positions, (position, depth) => `${String.fromCharCode(66 + depth)}${position}`).join('-');
      const stemSlides: OverviewSlide[] = [];

      each(this.props.slides.data, (slide) => {
        if (slide.stemRef === stem.ref) {
          stemSlides.push({ ...slide, to: `/scenarios/${this.props.scenario.data._id}/create?slide=${slide._id}`, });
        }
      });

      const firstSlide = stemSlides[0];

      if (stem.isRoot) {
        stemSlides.unshift({
          _id: 'CONSENT_SLIDE',
          stemRef: stem.ref,
          slideType: 'CONSENT',
          sortOrder: -1,
          to: `/scenarios/${this.props.scenario.data._id}/create?slide=CONSENT`
        });
      }

      if (childStems.length === 0) {
        stemSlides.push({
          _id: 'SUMMARY_SLIDE',
          stemRef: stem.ref,
          slideType: 'SUMMARY',
          sortOrder: stemSlides.length,
          to: `/scenarios/${this.props.scenario.data._id}/create?slide=SUMMARY`
        });
      }

      return {
        _id: stem._id,
        name: stem.name,
        to: `/scenarios/${this.props.scenario.data._id}/create?slide=${firstSlide._id}`,
        label,
        slides: stemSlides,
        stems: map(childStems, buildStem)
      };
    };

    return buildStem(rootStem);
  }

  parseTree = (stem: PositionedStem, offsetX = 0): PositionedStem => {
    const children = stem.stems || [];

    const stemWidth = (stem.slides.length * 32) + ((stem.slides.length - 1) * 12) + 8 + 8 + 4
    const childOffsetX = offsetX + stemWidth + GAP_X;

    for (const child of children) {
      this.parseTree(child, childOffsetX);
    }

    stem.x = offsetX;

    if (children.length === 0) {
      stem.y = this.nextY;
      this.nextY += GAP_Y;
    } else {
      // Centers the children to the parent
      stem.y = (children[0].y + children[children.length - 1].y) / 2;
    }

    const maxRight = stem.x + stemWidth;
    if (maxRight > this.maxWidth) {
      this.maxWidth = maxRight;
    }

    const maxBottom = stem.y + GAP_Y;
    if (maxBottom > this.maxHeight) {
      this.maxHeight = maxBottom;
    }

    for (const child of children) {
      this.edges.push({
        from: { x: stem.x + stemWidth, y: stem.y + STEM_HEIGHT / 2 },
        to: { x: child.x, y: child.y + STEM_HEIGHT / 2 }
      })
    }

    return stem;

  }

  onStemClicked = ({ stemRef }) => {
    const editor = getCache('editor');
    editor.set({ activeStemRef: stemRef });
  }

  render() {
    this.maxWidth = 0;
    this.maxHeight = 0;
    this.nextY = 0;
    this.edges = [];

    const rootStem = this.getTree();

    if (!rootStem) return null;

    const tree = this.parseTree(rootStem as PositionedStem, 0);

    return (
      <CreateOverview
        tree={tree}
        maxWidth={this.maxWidth}
        maxHeight={this.maxHeight}
        edges={this.edges}
        onStemClicked={this.onStemClicked}
      />
    );
  }
};

export default WithRouter(WithCache(CreateOverviewContainer, {}, ['editor', 'scenario', 'stems', 'slides']));
