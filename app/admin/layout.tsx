import type { Metadata } from "next";
import Link from "next/link";
import { MODULES } from "@/lib/modules/registry";
import styles from "./admin.module.css";

export const metadata: Metadata = {
  title: "GABBA Panel",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const platform = MODULES.filter((m) => m.layer === "PLATFORM");
  const is = MODULES.filter((m) => m.layer === "IS");

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href="/admin" className={styles.brand}>
          <span className={styles.brandName}>GABBA</span>
          <span className={styles.brandSub}>yönetim</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navHome}>
            Sistem haritası
          </Link>

          <p className={styles.navGroup}>Platform</p>
          {platform.map((m) => (
            <Link key={m.code} href={`/admin/moduller/${m.code}`} className={styles.navItem}>
              <span className={styles.navCode}>{m.code}</span>
              {m.name}
            </Link>
          ))}

          <p className={styles.navGroup}>İş</p>
          {is.map((m) => (
            <Link key={m.code} href={`/admin/moduller/${m.code}`} className={styles.navItem}>
              <span className={styles.navCode}>{m.code}</span>
              {m.name}
            </Link>
          ))}
        </nav>

        <div className={styles.sideFoot}>
          <Link href="/" className={styles.sideLink}>
            ← Siteye dön
          </Link>
        </div>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
