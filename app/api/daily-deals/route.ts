import { NextResponse } from "next/server";
import { getDailyDeals } from "@/lib/daily-deals";

export async function GET() {
  const deals = getDailyDeals(new Date());
  return NextResponse.json({
    date: new Date().toISOString().split("T")[0],
    deals,
  });
}
