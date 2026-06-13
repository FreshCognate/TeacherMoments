import getCache from "~/core/cache/helpers/getCache";
import { Stem } from "~/modules/stems/stems.types";
import filter from 'lodash/filter';

export default ({ activeSlideRef }: { activeSlideRef: string }) => {
  const allStems = getCache('stems').data;
  const stems = filter(allStems, { slideRef: activeSlideRef }) as Stem[];
  return stems;
}