export type OverviewSlide = {
  _id: string;
  stemRef: string;
  slideType: 'STEP' | 'CONSENT' | 'SUMMARY';
  sortOrder: number;
  to: string;
  isSelected: boolean;
};

export type OverviewStem = {
  _id: string;
  ref: string;
  name: string;
  to: string;
  label: string;
  slides: OverviewSlide[];
  childStemRefs: string[];
  stems?: OverviewStem[];
  canBeBranchedTo: boolean;
};

export type PositionedStem = Omit<OverviewStem, 'stems'> & {
  x: number;
  y: number;
  stems?: PositionedStem[];
};

export type Point = {
  x: number;
  y: number;
};

export type Edge = {
  from: Point;
  to: Point;
};

export const OVERVIEW_GAP_X = 120;
export const OVERVIEW_GAP_Y = 120;
export const OVERVIEW_STEM_HEIGHT = 52;
