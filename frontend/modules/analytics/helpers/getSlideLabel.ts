export default function getSlideLabel({ slideName, slideSortOrder, stemName }: {
  slideName?: string;
  slideSortOrder: number;
  stemName?: string | null;
}): string {
  const base = slideName || `Slide ${slideSortOrder + 1}`;
  return stemName ? `${stemName}: ${base}` : base;
}
