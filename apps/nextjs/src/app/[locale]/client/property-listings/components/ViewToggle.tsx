"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FaMap, FaThLarge } from "react-icons/fa";

interface ViewToggleProps {
  currentView: "grid" | "map";
}

const ViewToggle = ({ currentView }: ViewToggleProps) => {
  const t = useTranslations();
  const router = useRouter();

  const toggleView = () => {
    if (currentView === "grid") {
      router.push("/listing-real-estate-map");
    } else {
      router.push("/listing-real-estate");
    }
  };

  return (
    <button
      onClick={toggleView}
      className="fixed bottom-8 right-8 z-30 flex items-center justify-center space-x-2 rounded-full bg-neutral-900 px-6 py-3 text-sm text-white shadow-2xl transition-all hover:bg-neutral-700"
    >
      {currentView === "grid" ? (
        <>
          <FaMap className="text-lg" />
          <span>{t("showMap")}</span>
        </>
      ) : (
        <>
          <FaThLarge className="text-lg" />
          <span>{t("showGrid")}</span>
        </>
      )}
    </button>
  );
};

export default ViewToggle;
