import navigateTo from "./navigateTo";
import getNextSlide from "./getNextSlide";

export default async () => {

  const nextSlide = getNextSlide();

  navigateTo({ slideRef: nextSlide.ref });

}