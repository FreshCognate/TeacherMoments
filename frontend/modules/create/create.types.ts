export type OverviewSlide = {
  _id: string;
  stemRef: string;
  sortOrder: number;
};

export type OverviewStem = {
  _id: string;
  name: string;
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