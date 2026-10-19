import { Experience } from "@/components/Experience";
import { LanguageProvider } from "@/components/LanguageProvider";

export default function Home() {
  return (
    <LanguageProvider>
      <Experience />
    </LanguageProvider>
  );
}
