import getCache from "~/core/cache/helpers/getCache";
import getActiveStemRef from "./getActiveStemRef";
import filter from 'lodash/filter';

export default () => {
  const activeStemRef = getActiveStemRef();
  const slides = getCache('slides');
  if (!activeStemRef) return slides.data;
  return filter(slides.data, { stemRef: activeStemRef });
}