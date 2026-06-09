import { config } from "dotenv";
import { runMortgageRateScrape } from "@/lib/rates/run";

config({ path: ".env.local" });
config();

type ScheduleTime = {
  hour: number;
  minute: number;
};

const schedule = parseSchedule(process.env.RATE_SCRAPER_TIMES ?? "10:00,15:00");

console.log(`Rate scraper scheduler started. Local run times: ${schedule.map(formatScheduleTime).join(", ")}`);
void scheduleNextRun();

async function scheduleNextRun() {
  const next = getNextRun(schedule);
  const waitMs = next.date.getTime() - Date.now();
  console.log(`Next mortgage rate scrape: ${next.date.toString()}`);
  setTimeout(async () => {
    try {
      const result = await runMortgageRateScrape({ trigger: triggerForSchedule(next.time) });
      console.log(JSON.stringify({ event: "rate_scrape_complete", result }, null, 2));
    } catch (error) {
      console.error("Scheduled mortgage rate scrape failed", error);
    } finally {
      void scheduleNextRun();
    }
  }, waitMs);
}

function getNextRun(times: ScheduleTime[]) {
  const now = new Date();
  const candidates = times
    .map((time) => {
      const date = new Date(now);
      date.setHours(time.hour, time.minute, 0, 0);
      if (date.getTime() <= now.getTime()) {
        date.setDate(date.getDate() + 1);
      }
      return { date, time };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  return candidates[0];
}

function parseSchedule(value: string) {
  const times = value
    .split(",")
    .map((part) => part.trim())
    .map((part) => {
      const [hour, minute = "0"] = part.split(":");
      return { hour: Number(hour), minute: Number(minute) };
    })
    .filter((time) => Number.isInteger(time.hour) && Number.isInteger(time.minute) && time.hour >= 0 && time.hour <= 23 && time.minute >= 0 && time.minute <= 59);

  return times.length ? times : [{ hour: 10, minute: 0 }, { hour: 15, minute: 0 }];
}

function formatScheduleTime(time: ScheduleTime) {
  return `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`;
}

function triggerForSchedule(time: ScheduleTime) {
  if (time.hour === 10) return "schedule_10am";
  if (time.hour === 15) return "schedule_3pm";
  return "manual";
}
