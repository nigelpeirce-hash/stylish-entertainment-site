import { fetchActiveDJsForRoster } from "@/lib/dj-data";
import DJsPageContent from "./DJsPageContent";

// Roster data is fetched server-side so the DJ cards + internal links to
// each /artists/djs/[slug]/ profile are present in the initial HTML for
// crawlers and LLMs. Metadata is defined in layout.tsx so it stays correct.

export default async function DJsPage() {
  const djs = await fetchActiveDJsForRoster();
  return <DJsPageContent djs={djs} />;
}
