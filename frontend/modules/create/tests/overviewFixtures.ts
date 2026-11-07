import map from 'lodash/map';
import { Stem } from '~/modules/stems/stems.types';
import { Slide } from '~/modules/slides/slides.types';
import { OverviewSlide, PositionedStem } from '../create.types';

export const buildStem = (ref: string, childRefs: string[] = [], isRoot = false) => ({
  _id: `${ref}-id`,
  ref,
  name: ref,
  isRoot,
  branchingOptions: map(childRefs, (stemRef) => ({ stemRef, conditions: [] }))
}) as unknown as Stem;

export const buildSlide = (_id: string, stemRef: string) => ({
  _id,
  stemRef,
  slideType: 'STEP',
  sortOrder: 0
}) as unknown as Slide;

export const buildPositionedStem = ({
  ref,
  slideCount = 1,
  childStemRefs = [],
  stems = [],
  x = 0,
  y = 0
}: {
  ref: string,
  slideCount?: number,
  childStemRefs?: string[],
  stems?: PositionedStem[],
  x?: number,
  y?: number
}): PositionedStem => ({
  _id: `${ref}-id`,
  ref,
  name: ref,
  to: '',
  label: '',
  slides: map(Array(slideCount), (value, index) => ({ _id: `${ref}-slide-${index}` }) as OverviewSlide),
  childStemRefs,
  stems,
  canBeBranchedTo: false,
  x,
  y
});
