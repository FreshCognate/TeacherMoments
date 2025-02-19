import getFileType from "./getFileType";

export default async (file) => {

  return new Promise((resolve) => {

    const reader = new FileReader();

    reader.onload = function (e) {

      const fileType = getFileType(file);

      switch (fileType) {
        case 'image':

          const img = new Image();

          img.onload = function () {
            const { width, height } = img;
            let orientation = height > width ? "portrait" : "landscape";
            resolve({ width, height, orientation });
          };

          img.src = e.target.result;

          break;

        case 'video':

          var video = document.createElement("video");

          video.addEventListener("loadedmetadata", function () {
            const { videoWidth, videoHeight } = video;
            let orientation = videoHeight > videoWidth ? "portrait" : "landscape";
            resolve({ width: videoWidth, height: videoHeight, orientation });
          });

          video.src = e.target.result;

          break;

        case 'audio':
          resolve({});
          break;
      }
    };

    reader.readAsDataURL(file);

  });
}