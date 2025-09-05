import { useTranslations } from 'next-intl';
import Image from "next/image";
import { useRouter } from "next/navigation";
import PropertyListingsLink from "./property-listings-link";

export default function WelcomeScreen() {
  const t = useTranslations('Welcome');
  const router = useRouter();

  const categories = [
    {
      title: t('category.discover', { defaultValue: 'Discover' }),
      icon: "🏙️",
      steps: [
        t('category.discover.step1', { defaultValue: 'Browse properties in your city or worldwide.' }),
        t('category.discover.step2', { defaultValue: 'Filter by type, price, and amenities.' }),
        t('category.discover.step3', { defaultValue: 'See real photos and city highlights.' }),
      ],
      image: "/images/cities/istanbul.jpg",
    },
    {
      title: t('category.connect', { defaultValue: 'Connect' }),
      icon: "🤝",
      steps: [
        t('category.connect.step1', { defaultValue: 'Contact trusted agencies and agents.' }),
        t('category.connect.step2', { defaultValue: 'Read verified reviews and ratings.' }),
        t('category.connect.step3', { defaultValue: 'Ask questions and get expert advice.' }),
      ],
      image: "/images/cities/london.jpg",
    },
    {
      title: t('category.manage', { defaultValue: 'Manage' }),
      icon: "📅",
      steps: [
        t('category.manage.step1', { defaultValue: 'Book, reserve, and track your stays.' }),
        t('category.manage.step2', { defaultValue: 'Manage tasks, contracts, and payments.' }),
        t('category.manage.step3', { defaultValue: 'Leave feedback and help others decide.' }),
      ],
      image: "/images/cities/newyork.jpg",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 px-2">
      <div className="mb-8 text-center">
        <Image src="/images/logo.svg" alt="Reservatior Logo" width={80} height={80} className="mx-auto mb-6 w-20 h-20" priority />
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 dark:text-blue-300 mb-3 drop-shadow-sm">
          {t('title', { defaultValue: 'Welcome to Reservatior' })}
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          {t('intro', { defaultValue: 'Your all-in-one platform to discover, connect, and manage properties, agencies, and rentals—trusted by professionals and renters alike.' })}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-12">
        {categories.map((cat) => (
          <div
            key={cat.title}
            className="relative bg-white/90 dark:bg-blue-900/90 backdrop-blur-md rounded-2xl shadow-xl ring-1 ring-blue-200 flex flex-col items-center p-6 md:p-8 text-center overflow-hidden hover:scale-[1.03] transition"
          >
            <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
              <Image
                src={cat.image}
                alt={cat.title + " city"}
                fill
                className="object-cover opacity-20"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={cat.title === "Discover"}
              />
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-4xl mb-2">{cat.icon}</span>
              <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-200 mb-2">
                {cat.title}
              </h2>
              <ol className="text-slate-600 dark:text-slate-200 text-left mx-auto space-y-2 list-decimal list-inside">
                {cat.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row gap-4 justify-center w-full max-w-lg mb-8">
        <button
          className="flex-1 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 text-base shadow-md transition"
          onClick={() => router.push("/auth/login")}
        >
          {t('signIn', { defaultValue: 'Sign In' })}
        </button>
        <button
          className="flex-1 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-3 text-base shadow-md transition"
          onClick={() => router.push("/auth/signup")}
        >
          {t('signUp', { defaultValue: 'Sign Up' })}
        </button>
        <button
          className="flex-1 rounded-xl bg-slate-400 hover:bg-slate-600 text-white font-semibold py-3 text-base shadow-md transition"
          onClick={() => router.push("/client-home")}
        >
          {t('exploreGuest', { defaultValue: 'Explore as Guest' })}
        </button>
      </div>
      <PropertyListingsLink />
      <div className="mt-10 text-slate-400">
        <small>
          {new Date().getFullYear()} Reservatior. {t('copyright', { defaultValue: 'All rights reserved.' })}
        </small>
      </div>
    </div>
  );
}
