import navigateTo from "./navigateTo";
import getNextSlide from "./getNextSlide";

export default async ({ router }) => {

  const nextSlide = getNextSlide();

  navigateTo({ slideRef: nextSlide.ref, router });

}