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
  stems?: OverviewStem[];
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