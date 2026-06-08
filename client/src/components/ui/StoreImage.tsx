import { getInitials, storeGradient } from "../../utils/storeImage";

type Props = {
  storeName: string;
  ownerName?: string;
  imageUrl?: string | null;
  className?: string;
  size?: "card" | "profile";
};

const StoreImage = ({
  storeName,
  ownerName,
  imageUrl,
  className = "",
  size = "card",
}: Props) => {
  const fallbackName = ownerName || storeName;
  const initials = getInitials(fallbackName);
  const gradient = storeGradient(storeName);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={`${storeName} store`}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  const textSize = size === "profile" ? "text-4xl" : "text-5xl";

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient} ${className}`}
    >
      <span className={`${textSize} font-bold text-white/90`}>{initials}</span>
    </div>
  );
};

export default StoreImage;
