import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { PHONE, PHONE_DISPLAY, WA_LINK, INSTAGRAM } from "@/lib/site";
import styles from "./site-chrome.module.css";

/**
 * İç sayfalarda kullanılan ortak başlık ve alt bilgi.
 *
 * Ana sayfanın başlığı ayrıdır: hero fotoğrafının üstünde saydam
 * başlayıp kaydırınca opaklaşıyor. Burada içerik hemen başladığı için
 * başlık baştan opak.
 */

const MENU = [
  { href: "/collections", label: "Колекції" },
  { href: "/blog", label: "Блог" },
  { href: "/about", label: "Про нас" },
  { href: "/faq", label: "Питання" },
  { href: "/contact", label: "Контакти" },
];

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo} aria-label="GABBA — головна">
        <Image
          src="/images/logo/gabba-logo.png"
          alt="GABBA"
          width={108}
          height={26}
          priority
        />
      </Link>

      <nav className={styles.nav}>
        {MENU.map((m) => (
          <Link key={m.href} href={m.href}>
            {m.label}
          </Link>
        ))}
      </nav>

      <div className={styles.actions}>
        <a href={`tel:${PHONE}`} className={styles.icon} aria-label="Зателефонувати">
          <Phone size={19} strokeWidth={1.6} />
        </a>
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.icon}
          aria-label="WhatsApp"
        >
          <WhatsAppIcon size={19} />
        </a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <Image
        src="/images/logo/gabba-logo.png"
        alt="GABBA"
        width={92}
        height={22}
        className={styles.footerLogo}
      />

      <nav className={styles.footerNav}>
        {MENU.map((m) => (
          <Link key={m.href} href={m.href}>
            {m.label}
          </Link>
        ))}
      </nav>

      <div className={styles.footerContact}>
        <a href={`tel:${PHONE}`} className={styles.footerPhone}>
          {PHONE_DISPLAY}
        </a>
      </div>

      <a
        href={INSTAGRAM}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.footerIg}
      >
        Instagram @gabba.home
      </a>

      <p className={styles.footerCopy}>
        © {new Date().getFullYear()} GABBA Ukraine · www.gabbaukraine.com
      </p>
    </footer>
  );
}

/** Mobilde sabit iletişim çubuğu */
export function SiteBar() {
  return (
    <div className={styles.bar}>
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.barPrimary}
      >
        <WhatsAppIcon size={17} />
        Написати нам
      </a>
      <a href={`tel:${PHONE}`} className={styles.barSecondary} aria-label="Зателефонувати">
        <Phone size={18} strokeWidth={1.6} />
      </a>
    </div>
  );
}
