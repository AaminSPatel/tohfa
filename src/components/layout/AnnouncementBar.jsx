import { siteConfig } from "@/data/siteConfig";
import { hinglish } from "@/data/hinglish";

export default function AnnouncementBar() {
  const [first, second, ...rest] = [siteConfig.announcement[0], siteConfig.announcement[1], hinglish.announcement].filter(Boolean);
  void rest;
  return (
    <div className="bg-ink text-paper">
      <div className="container-page flex h-9 items-center justify-center gap-8 text-[0.8rem]">
        <p>{first}</p>
        {second && <p className="hidden md:block">{second}</p>}
        {rest.map((t) => <p key={t} className="hidden xl:block">{t}</p>)}
      </div>
    </div>
  );
}
