import { OverviewStem } from '../create.types';

export default ({ stem }: { stem: Pick<OverviewStem, 'slides'> }): number => {
  return (stem.slides.length * 32) + ((stem.slides.length - 1) * 12) + 8 + 8 + 4;
};
