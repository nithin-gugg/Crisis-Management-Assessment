"use client";

import { TestimonialsSection } from "@/components/blocks/simple-animated-testimonials";

export function TestimonialsSectionBasic() {
  return (
    <TestimonialsSection
      title="Trusted by Global Enterprises"
      subtitle="See how our platform empowers organizations to maintain operational resilience during critical disruptions."
      testimonials={[
        {
          id: 1,
          name: "Sarah Jenkins",
          role: "Chief Risk Officer",
          company: "Global Logistics Inc.",
          content:
            "This crisis management platform revolutionized how we handle supply chain disruptions. The real-time mapping and localized threat tracking allowed us to reroute shipments days ahead of major weather events, saving us millions.",
          rating: 5,
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
        },
        {
          id: 2,
          name: "Marcus Vance",
          role: "VP of Operations",
          company: "SecureNet Financial",
          content:
            "The integrated response protocols and automated staff communication transformed our disaster recovery plan from a dusty binder into an agile, living system. Our recovery time objective (RTO) dropped by 40%.",
          rating: 5,
          avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
        },
        {
          id: 3,
          name: "Dr. Elena Rostova",
          role: "Director of Emergency Management",
          company: "Metro Health Systems",
          content:
            "During the recent regional power grid failure, the platform's AI copilot instantly surfaced our backup generator capacities and critical patient data, enabling us to make life-saving decisions without hesitation.",
          rating: 5,
          avatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=200&auto=format&fit=crop",
        },
      ]}
      trustedCompanies={["Acme Corp", "Wayne Enterprises", "Stark Industries", "Massive Dynamic", "Initech"]}
      trustedCompaniesTitle="Trusted by innovative teams worldwide"
    />
  );
}
