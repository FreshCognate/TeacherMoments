import React, { Component } from 'react';
import CreateOverview from '../components/createOverview';
import WithCache from '~/core/cache/containers/withCache';
import { Stem } from '~/modules/stems/stems.types';
import find from 'lodash/find';
import filter from 'lodash/filter';
import { OverviewSlide, OverviewStem, PositionedStem, Edge } from '../create.types';

type Props = {
  stems: { data: Stem[] };
  slides: { data: OverviewSlide[] };
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

    const stemSlides = filter(this.props.slides.data, { stemRef: rootStem.ref });

    return {
      _id: rootStem._id,
      name: 'A',
      slides: stemSlides,
      stems: [{
        _id: "stem-b1",
        name: "B1",
        slides: [{
          _id: "b1-12345",
          stemRef: "a1-12345",
          sortOrder: 0
        }, {
          _id: "b1-23456",
          stemRef: "a1-12345",
          sortOrder: 1
        }],
        stems: [{
          _id: "stem-b1-c1",
          name: "B1-C1",
          slides: [{
            _id: "c1-12345",
            stemRef: "stem-c1",
            sortOrder: 0
          }, {
            _id: "c1-23456",
            stemRef: "stem-c1",
            sortOrder: 1
          }, {
            _id: "c1-34567",
            stemRef: "stem-c1",
            sortOrder: 2
          }]
        }, {
          _id: "stem-b1-c2",
          name: "B1-C2",
          slides: [{
            _id: "c2-12345",
            stemRef: "stem-c2",
            sortOrder: 0
          }, {
            _id: "c2-23456",
            stemRef: "stem-c2",
            sortOrder: 1
          }]
        }]
      }, {
        _id: "a2-12345",
        name: "B2",
        slides: [{
          _id: "b1-12345",
          stemRef: "a1-12345",
          sortOrder: 0
        }, {
          _id: "b1-23456",
          stemRef: "a1-12345",
          sortOrder: 1
        }],
        stems: [{
          _id: "stem-b2-c1",
          name: "B2-C1",
          slides: [{
            _id: "c1-12345",
            stemRef: "stem-c1",
            sortOrder: 0
          }]
        }]
      }]
    };
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
      />
    );
  }
};

export default WithCache(CreateOverviewContainer, {}, ['stems', 'slides']);
