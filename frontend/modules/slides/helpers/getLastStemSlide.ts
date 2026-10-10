import getCurrentStemSlides from "~/modules/stems/helpers/getCurrentStemSlides"

export default () => {
  const stemSlides = getCurrentStemSlides();
  return stemSlides[stemSlides.length - 1];
}