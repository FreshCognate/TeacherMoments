import React, { Component } from 'react';
import axios from 'axios';
import CreateOverview from '../components/createOverview';
import WithCache from '~/core/cache/containers/withCache';
import { Stem } from '~/modules/stems/stems.types';
import { Slide } from '~/modules/slides/slides.types';
import { Scenario } from '~/modules/scenarios/scenarios.types';
import find from 'lodash/find';
import map from 'lodash/map';
import each from 'lodash/each';
import has from 'lodash/has';
import keys from 'lodash/keys';
import includes from 'lodash/includes';
import getChildStems from '~/modules/stems/helpers/getChildStems';
import getStemHierarchy from '../helpers/getStemHierarchy';
import getActiveStemRef from '~/modules/stems/helpers/getActiveStemRef';
import { OverviewSlide, OverviewStem, PositionedStem, Edge } from '../create.types';
import WithRouter from '~/core/app/components/withRouter';
import getScenarioDetails from '~/modules/run/helpers/getScenarioDetails';
import handleRequestError from '~/core/app/helpers/handleRequestError';

type Props = {
  editor: {
    set: (data: { stemPath?: string[], branchToStem?: string | null }) => void;
    data: any;
  };
  scenario: { data: Scenario };
  stems: { data: Stem[], fetch: () => Promise<any> };
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

  setCanBeBranchedTo = (tree: OverviewStem, columnsByRef: Record<string, number>) => {
    const { branchToStem } = this.props.editor.data;

    if (!branchToStem || !has(columnsByRef, branchToStem)) return;

    const branchToStemColumn = columnsByRef[branchToStem];
    const branchFromStem = find(this.props.stems.data, { ref: branchToStem });
    const branchToStemChildRefs = map(getChildStems({ stem: branchFromStem }), 'ref');

    const setStemCanBeBranchedTo = (stem: OverviewStem) => {
      const isInLaterColumn = columnsByRef[stem.ref] > branchToStemColumn;
      const isAlreadyChild = includes(branchToStemChildRefs, stem.ref);
      stem.canBeBranchedTo = isInLaterColumn && !isAlreadyChild;
      each(stem.stems, setStemCanBeBranchedTo);
    };

    setStemCanBeBranchedTo(tree);
  }

  getTree = (): OverviewStem | null => {
    const rootStem = find(this.props.stems.data, { isRoot: true });

    if (!rootStem) return null;

    const builtStemRefs = new Set<string>();
    const { depthsByRef: columnsByRef, ownerRefsByRef } = getStemHierarchy({
      stems: this.props.stems.data,
      rootStem
    });

    const buildStem = (stem: Stem, positions: number[] = []): OverviewStem => {
      builtStemRefs.add(stem.ref);
      const childStems = getChildStems({ stem });

      const label = positions.length === 0
        ? 'A'
        : map(positions, (position, depth) => `${String.fromCharCode(66 + depth)}${position}`).join('-');
      const stemSlides: OverviewSlide[] = [];

      const { activeSlideId } = getScenarioDetails();

      each(this.props.slides.data, (slide) => {
        if (slide.stemRef === stem.ref) {
          let isSelected = false;
          if (slide._id === activeSlideId) {
            isSelected = true;
          }
          stemSlides.push({ ...slide, to: `/scenarios/${this.props.scenario.data._id}/create?slide=${slide._id}`, isSelected });
        }
      });

      const firstSlide = stemSlides[0];

      if (stem.isRoot) {
        let isSelected = false;
        if (activeSlideId === 'CONSENT') {
          isSelected = true;
        }
        stemSlides.unshift({
          _id: 'CONSENT_SLIDE',
          stemRef: stem.ref,
          slideType: 'CONSENT',
          sortOrder: -1,
          to: `/scenarios/${this.props.scenario.data._id}/create?slide=CONSENT`,
          isSelected
        });
      }

      if (childStems.length === 0) {
        let isSelected = false;
        if (activeSlideId === 'SUMMARY' && stem.ref === getActiveStemRef()) {
          isSelected = true;
        }
        stemSlides.push({
          _id: 'SUMMARY_SLIDE',
          stemRef: stem.ref,
          slideType: 'SUMMARY',
          sortOrder: stemSlides.length,
          to: `/scenarios/${this.props.scenario.data._id}/create?slide=SUMMARY`,
          isSelected
        });
      }

      const builtChildStems: OverviewStem[] = [];

      each(childStems, (childStem) => {
        if (builtStemRefs.has(childStem.ref)) return;
        if (ownerRefsByRef[childStem.ref] !== stem.ref) return;
        builtChildStems.push(buildStem(childStem, [...positions, builtChildStems.length + 1]));
      });

      return {
        _id: stem._id,
        ref: stem.ref,
        name: stem.name,
        to: `/scenarios/${this.props.scenario.data._id}/create?slide=${firstSlide._id}`,
        label,
        slides: stemSlides,
        childStemRefs: map(childStems, 'ref'),
        stems: builtChildStems,
        canBeBranchedTo: false
      };
    };

    const tree = buildStem(rootStem);

    this.setCanBeBranchedTo(tree, columnsByRef);

    return tree;
  }

  getStemWidth = (stem: OverviewStem) => {
    return (stem.slides.length * 32) + ((stem.slides.length - 1) * 12) + 8 + 8 + 4;
  }

  getStemsByRef = (stem: PositionedStem, stemsByRef: Record<string, PositionedStem> = {}) => {
    stemsByRef[stem.ref] = stem;
    each(stem.stems, (childStem) => this.getStemsByRef(childStem, stemsByRef));
    return stemsByRef;
  }

  getOffsetsX = (stemsByRef: Record<string, PositionedStem>) => {
    const parentStemRefsByRef: Record<string, string[]> = {};

    each(stemsByRef, (stem) => {
      each(stem.childStemRefs, (childStemRef) => {
        parentStemRefsByRef[childStemRef] = [...(parentStemRefsByRef[childStemRef] || []), stem.ref];
      });
    });

    const offsetsX: Record<string, number> = {};

    const getOffsetX = (stemRef: string): number => {
      if (has(offsetsX, stemRef)) return offsetsX[stemRef];
      offsetsX[stemRef] = 0;
      each(parentStemRefsByRef[stemRef], (parentStemRef) => {
        const parentRight = getOffsetX(parentStemRef) + this.getStemWidth(stemsByRef[parentStemRef]);
        offsetsX[stemRef] = Math.max(offsetsX[stemRef], parentRight + GAP_X);
      });
      return offsetsX[stemRef];
    };

    each(keys(stemsByRef), getOffsetX);

    return offsetsX;
  }

  getEdges = (stemsByRef: Record<string, PositionedStem>): Edge[] => {
    const edges: Edge[] = [];

    each(stemsByRef, (stem) => {
      each(stem.childStemRefs, (childStemRef) => {
        const childStem = stemsByRef[childStemRef];
        if (!childStem) return;
        edges.push({
          from: { x: stem.x + this.getStemWidth(stem), y: stem.y + STEM_HEIGHT / 2 },
          to: { x: childStem.x, y: childStem.y + STEM_HEIGHT / 2 }
        });
      });
    });

    return edges;
  }

  parseTree = (stem: PositionedStem, offsetsX: Record<string, number>): PositionedStem => {
    const children = stem.stems || [];

    const stemWidth = this.getStemWidth(stem);

    for (const child of children) {
      this.parseTree(child, offsetsX);
    }

    stem.x = offsetsX[stem.ref];

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

    return stem;

  }

  onStemClicked = ({ stemRef }: { stemRef: string }) => {
    this.props.editor.set({ stemPath: [stemRef] });
  }

  onBranchToStemClicked = ({ stemRef }: { stemRef: string | null }) => {
    this.props.editor.set({ branchToStem: stemRef });
  }

  onLinkToStemClicked = ({ stemRef }: { stemRef: string }) => {
    const { branchToStem } = this.props.editor.data;
    const branchFromStem = find(this.props.stems.data, { ref: branchToStem });

    this.props.editor.set({ branchToStem: null });

    if (!branchFromStem || find(branchFromStem.branchingOptions, { stemRef })) return;

    axios.put(`/api/stems/${branchFromStem._id}`, {
      branchingOptions: [...branchFromStem.branchingOptions, { stemRef, conditions: [] }]
    }).then(() => {
      this.props.stems.fetch();
    }).catch(handleRequestError);
  }

  render() {
    this.maxWidth = 0;
    this.maxHeight = 0;
    this.nextY = 0;
    this.edges = [];

    const rootStem = this.getTree();

    if (!rootStem) return null;

    const stemsByRef = this.getStemsByRef(rootStem as PositionedStem);
    const tree = this.parseTree(rootStem as PositionedStem, this.getOffsetsX(stemsByRef));
    this.edges = this.getEdges(stemsByRef);

    return (
      <CreateOverview
        tree={tree}
        maxWidth={this.maxWidth}
        maxHeight={this.maxHeight}
        edges={this.edges}
        branchToStem={this.props.editor.data.branchToStem}
        onStemClicked={this.onStemClicked}
        onBranchToStemClicked={this.onBranchToStemClicked}
        onLinkToStemClicked={this.onLinkToStemClicked}
      />
    );
  }
};

export default WithRouter(WithCache(CreateOverviewContainer, {}, ['editor', 'scenario', 'stems', 'slides']));
