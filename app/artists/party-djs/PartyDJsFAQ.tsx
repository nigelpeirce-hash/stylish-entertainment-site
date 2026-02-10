"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do you take requests?",
    answer:
      "Yes, absolutely! We encourage requests and work with you to create a playlist that reflects your musical taste. We also have the ability to read the crowd and adjust the music accordingly to keep everyone dancing.",
  },
  {
    question: "When do you set up?",
    answer:
      "We typically arrive 2-3 hours before your event start time to set up all equipment. This ensures everything is tested and ready to go, minimizing any disruption to your celebration. Early setup can be arranged if needed.",
  },
  {
    question: "What equipment do you provide?",
    answer:
      "We provide premium sound systems, professional DJ equipment, wireless microphones, and all necessary cables and accessories. All equipment is PAT tested and fully insured with £10m public liability insurance.",
  },
  {
    question: "Can you provide MC services?",
    answer:
      "Yes, our DJs can provide professional MC services including announcements, introductions, and coordinating key moments throughout your event.",
  },
  {
    question: "Do you work at venues like Babington House?",
    answer:
      "Yes, we have been a trusted supplier at Babington House since 2003 and work regularly with premium venues in the South West and beyond. Our fully insured and PAT tested equipment meets all venue requirements.",
  },
];

export default function PartyDJsFAQ() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
        Frequently Asked Questions
      </h3>
      <Card className="bg-gray-800/50 backdrop-blur-md border-champagne-gold/50">
        <CardContent className="p-6">
          <Accordion type="single" className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
}
