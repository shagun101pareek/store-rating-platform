export const storeGradient = (seed: string) => {
  const hash = seed
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradients = [
    "from-slate-600 to-slate-800",
    "from-blue-500 to-indigo-700",
    "from-emerald-500 to-teal-700",
    "from-amber-500 to-orange-700",
    "from-rose-500 to-pink-700",
    "from-violet-500 to-purple-700",
  ];
  return gradients[hash % gradients.length];
};

export const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const MAX_IMAGE_DATA_URL_LENGTH = 400000;

export const readImageAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please select an image file."));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      reject(new Error("Image must be smaller than 5MB."));
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const maxWidth = 800;
      const maxHeight = 600;
      let { width, height } = img;
      const scale = Math.min(1, maxWidth / width, maxHeight / height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Failed to process image."));
        return;
      }

      context.drawImage(img, 0, 0, width, height);

      let quality = 0.85;
      let dataUrl = canvas.toDataURL("image/jpeg", quality);

      while (
        dataUrl.length > MAX_IMAGE_DATA_URL_LENGTH &&
        quality > 0.45
      ) {
        quality -= 0.1;
        dataUrl = canvas.toDataURL("image/jpeg", quality);
      }

      if (dataUrl.length > MAX_IMAGE_DATA_URL_LENGTH) {
        reject(
          new Error(
            "Image is too large after compression. Try a smaller photo."
          )
        );
        return;
      }

      resolve(dataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image."));
    };

    img.src = objectUrl;
  });
