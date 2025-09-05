
import PlacesList from "./PlacesList";
import { useLanguage } from "~/context/LanguageContext";

export default function PlacesPage() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 ios-layout android-layout">
      <div className="mobile-fade-in">
        <h1 className="mb-2 mobile-text-xl font-bold lg:text-3xl">{t('places.page.title')}</h1>
        <p className="mb-8 mobile-text-base text-gray-600 dark:text-gray-300">
          {t('places.page.description')}
        </p>
      </div>
      <PlacesList />
    </div>
  );
}
