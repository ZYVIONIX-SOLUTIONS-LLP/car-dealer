import type { Metadata } from "next";
import { ContactSection } from "@/components/site/contact-section";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Velocity Motors for enquiries, test drives, and support.",
};

export default function ContactPage() {
  return (
    <div className="py-8">
      <ContactSection />
    </div>
  );
}
