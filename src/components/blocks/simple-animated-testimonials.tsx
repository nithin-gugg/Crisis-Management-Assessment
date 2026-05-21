"use client"

import Image from "next/image"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { motion, useAnimation, useInView, type Variants } from "framer-motion"
import { useEffect, useRef, useState } from "react"

export interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar: string
}

export interface TestimonialsSectionProps {
  title?: string
  subtitle?: string
  testimonials?: Testimonial[]
  autoRotateInterval?: number
  showVerifiedBadge?: boolean
  trustedCompanies?: string[]
  trustedCompaniesTitle?: string
  className?: string
}

export function TestimonialsSection({
  title = "Loved by Developers",
  subtitle = "See what others are saying about our premium starter template",
  testimonials = [],
  autoRotateInterval = 6000,
  showVerifiedBadge = true,
  trustedCompanies = [],
  trustedCompaniesTitle = "Trusted by teams at these companies and more",
  className,
}: TestimonialsSectionProps) {
  // State for active testimonial
  const [activeIndex, setActiveIndex] = useState(0)

  // Refs for scroll animations
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const controls = useAnimation()

  // Automatically cycle through testimonials
  useEffect(() => {
    if (autoRotateInterval <= 0 || testimonials.length <= 1) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, autoRotateInterval)

    return () => clearInterval(interval)
  }, [testimonials.length, autoRotateInterval])

  // Trigger animations when section comes into view
  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  // Handlers for navigation
  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  if (testimonials.length === 0) {
    return null
  }

  return (
    <>
      <section
        ref={sectionRef}
        id="testimonials-alt"
        className={cn("py-16 md:py-32 relative overflow-hidden flex justify-center", className)}
      >
        <div className="container items-center px-4 md:px-6">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={containerVariants}
            className="text-center mb-12 space-y-4"
          >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {title}
            </motion.h2>
            <motion.p variants={itemVariants} className="text-muted-foreground max-w-[700px] mx-auto md:text-xl/relaxed">
              {subtitle}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={controls}
            variants={containerVariants}
            className="flex flex-col items-center gap-8 max-w-[900px] mx-auto w-full"
          >
            <motion.div variants={itemVariants} className="relative w-full">
              <div className="absolute -top-6 -left-6 z-10">
                <Quote className="h-12 w-12 text-blue-500/30" strokeWidth={1} />
              </div>

              {/* Testimonial cards */}
              <div className="grid grid-cols-1">
                {testimonials.map((testimonial, index) => (
                  <Card
                    key={testimonial.id}
                    className={cn(
                      "col-start-1 row-start-1 transition-all duration-500 border bg-[#111827] backdrop-blur-sm border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)] w-full",
                      index === activeIndex
                        ? "opacity-100 translate-x-0 shadow-lg z-10"
                        : "opacity-0 translate-x-[100px] pointer-events-none z-0",
                    )}
                  >
                    <CardContent className="p-8 md:p-10 h-full flex flex-col items-center text-center">
                      <div className="flex flex-col items-center gap-4 mb-4">
                        {/* <Avatar className="h-16 w-16 border-2 border-blue-500/30">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback className="text-gray-900">{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar> */}
                        <div>
                          <h4 className="font-semibold text-white text-lg">{testimonial.name}</h4>
                          <p className="text-sm text-blue-400 font-medium">
                            {testimonial.role}, {testimonial.company}
                          </p>
                        </div>
                        <div className="flex justify-center mt-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          ))}
                        </div>
                      </div>

                      <Separator className="my-6 border-blue-500/20 w-1/2 mx-auto" />

                      <p className="flex-1 italic text-lg/relaxed text-gray-300">"{testimonial.content}"</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Navigation buttons */}
            <motion.div variants={itemVariants} className="flex gap-4 justify-center items-center mt-6 w-full">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                className="rounded-full h-10 w-10 border-blue-500/30 bg-[#111827]/50 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex gap-2 items-center justify-center mx-4">
                {testimonials.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors cursor-pointer",
                      index === activeIndex ? "bg-blue-500 scale-125" : "bg-blue-500/20 hover:bg-blue-500/50",
                    )}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveIndex(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setActiveIndex(index)
                      }
                    }}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="rounded-full h-10 w-10 border-blue-500/30 bg-[#111827]/50 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* Logo cloud - Dedicated white background section */}
      {trustedCompanies.length > 0 && (
        <section className="w-full bg-white py-16 flex justify-center border-t border-gray-200">
          <div className="container px-4 md:px-6">
            <div className="w-full">
              <h3 className="text-sm font-medium text-gray-500 text-center mb-8 uppercase tracking-wider">
                {trustedCompaniesTitle}
              </h3>
              <div className="relative w-full overflow-hidden flex [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
                <motion.div
                  className="flex min-w-full shrink-0 items-center justify-around gap-16 px-8"
                  animate={{ x: ["0%", "-100%"] }}
                  transition={{ duration: 30, ease: "linear", repeat: Infinity }}
                >
                  {trustedCompanies.map((logoUrl, idx) => (
                    <div key={idx} className="relative w-48 h-24 shrink-0">
                      <Image src={logoUrl} alt={`Company logo ${idx + 1}`} fill className="object-contain" />
                    </div>
                  ))}
                </motion.div>
                <motion.div
                  className="flex min-w-full shrink-0 items-center justify-around gap-16 px-8"
                  animate={{ x: ["0%", "-100%"] }}
                  transition={{ duration: 30, ease: "linear", repeat: Infinity }}
                >
                  {trustedCompanies.map((logoUrl, idx) => (
                    <div key={idx} className="relative w-48 h-24 shrink-0">
                      <Image src={logoUrl} alt={`Company logo ${idx + 1}`} fill className="object-contain" />
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
