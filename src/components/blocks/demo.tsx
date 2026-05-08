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
           name: "Sr. Manager | L&D",
          role: "Learning & Development",
          company: "Silver Skills",
          content:
      "We had the pleasure of working with Maple Learning Solutions on our recent training project, and the experience exceeded our expectations. The team was thorough, professional, and communicative throughout, ensuring a seamless process from planning to delivery. The training itself was well-structured, engaging, and even surpassed expectations in certain areas. What stood out was their approachability, competence, and openness to feedback, which made collaboration smooth and productive.",
          rating: 5,
          avatar:
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
        },
     {
        id: 2,
        name: "Fatima Hassan",
        role: "Operations Manager",
        company: "Prime Health Group",
        content:
      "Collaborating with Maple Learning Solutions was an exceptional experience from start to finish. Their team brought a perfect balance of professionalism, creativity, and technical expertise to our project, ensuring that every aspect of the training was carefully planned and executed. The instructional design and eLearning solutions they provided were engaging, practical, and delivered measurable improvements in learner engagement and performance.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Samantha Lee",
    role: "Training Manager",
    company: "NovaTech Inc.",
    content:
      "Maple Learning Solutions completely transformed our training effectiveness. Their AI-powered platform increased learner engagement by 300% and reduced training time by 40% while significantly improving knowledge retention. The personalized learning experience exceeded all our expectations and delivered immediate improvements in employee performance.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Rachel Kim",
    role: "HR Manager",
    company: "Apex Solutions",
    content:
      "The personalized learning experience delivered by Maple Learning Solutions exceeded all our expectations. We saw dramatic improvements in training completion rates, stronger employee performance, and much higher learner engagement across teams. Their team was responsive, collaborative, and committed to delivering impactful results.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  },
]}
      trustedCompanies={["Cognizant", "Service Now", "Thomson Reuters", "Accenture", "Michelin"]}
      trustedCompaniesTitle="Trusted by innovative teams worldwide"
    />
  );
}
