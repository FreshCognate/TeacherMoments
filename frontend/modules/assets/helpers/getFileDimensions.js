export default async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const { width, height } = img;
        let orientation = height > width ? "portrait" : "landscape";
        resolve({ width, height, orientation });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}