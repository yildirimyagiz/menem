import Image from "next/image";

import { useTranslations } from "next-intl";
import Heading from "~/shared/Heading";

export interface People {
  id: string;
  name: string;
  job: string;
  avatar: string;
}

const SectionFounder = () => {
  const t = useTranslations('About');
  const FOUNDER_DEMO: People[] = [
    {
      id: "1",
      name: `Niamh O'Shea`,
      job: t('founderJob.ceo', { defaultValue: 'Co-founder and Chief Executive' }),
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "4",
      name: `Danien Jame`,
      job: t('founderJob.ceo', { defaultValue: 'Co-founder and Chief Executive' }),
      avatar:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "3",
      name: `Orla Dwyer`,
      job: t('founderJob.chairman', { defaultValue: 'Co-founder, Chairman' }),
      avatar:
        "https://images.unsplash.com/photo-1560365163-3e8d64e762ef?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "2",
      name: `Dara Frazier`,
      job: t('founderJob.cso', { defaultValue: 'Co-Founder, Chief Strategy Officer' }),
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    },
  ];

  return (
    <div className="nc-SectionFounder relative">
      <Heading
        desc={t('founderDesc', { defaultValue: "We're impartial and independent, and every day we create distinctive, world-class programmes and content" })}
      >
        {t('founderTitle', { defaultValue: '⛱ Founder' })}
      </Heading>
      <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {FOUNDER_DEMO.map((item) => (
          <div key={`founder-${item.id}`} className="max-w-sm">
            <div className="aspect-h-1 aspect-w-1 relative h-0 overflow-hidden rounded-xl">
              <Image
                fill
                className="object-cover"
                src={item.avatar}
                alt=""
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 30vw, 30vw"
              />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-200 md:text-xl">
              {item.name}
            </h3>
            <span className="block text-sm text-neutral-500 dark:text-neutral-400 sm:text-base">
              {item.job}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionFounder;


