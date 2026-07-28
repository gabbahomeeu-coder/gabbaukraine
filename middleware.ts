import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * YON-01 · Panel erişim koruması (geçici)
 *
 * Gerçek kullanıcı sistemi (AdminUser, roller) veritabanı kurulunca gelecek.
 * O zamana kadar panel basit bir kullanıcı adı/şifre ile korunuyor —
 * açıkta kalmasın.
 *
 * .env.local:
 *   ADMIN_USER=onur
 *   ADMIN_PASSWORD=uzun-bir-parola
 *
 * Değerler tanımlı değilse panel tamamen kapatılır; yanlışlıkla korumasız
 * yayına çıkmasın.
 */
export function middleware(request: NextRequest) {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;

  if (!user || !password) {
    return new NextResponse(
      "Panel kapalı: ADMIN_USER ve ADMIN_PASSWORD tanımlanmamış.",
      { status: 503 }
    );
  }

  const header = request.headers.get("authorization");

  if (header?.startsWith("Basic ")) {
    const decoded = atob(header.slice(6));
    const ayirici = decoded.indexOf(":");
    const gelenUser = decoded.slice(0, ayirici);
    const gelenSifre = decoded.slice(ayirici + 1);

    if (gelenUser === user && gelenSifre === password) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Giriş gerekli", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="GABBA Panel", charset="UTF-8"' },
  });
}

export const config = {
  matcher: "/admin/:path*",
};
