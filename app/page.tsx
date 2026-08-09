import type { Metadata } from 'next';
import DemoOne from '@/components/ui/demo';
import { constructMetadata, getSoftwareAppSchema, getFaqSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = constructMetadata({
  title: 'Huntme | AI-Powered OSINT & Intelligence Platform',
  description:
    'Search phone telemetry, vehicle registrations, and uncover connected entities with AI-driven open source intelligence. Fast, lawful, and enterprise-ready.',
  path: '/',
  keywords: [
    'AI OSINT Platform',
    'Open Source Intelligence Tool',
    'Phone OSINT Search',
    'Vehicle Registration Lookup',
    'AI Case Assistant',
    'Cyber Investigation Software',
    'Threat Hunting OSINT',
  ],
});

const homepageFaqs = [
  {
    q: 'What is Huntme?',
    a: 'Huntme is an AI-powered Open Source Intelligence (OSINT) platform that helps investigators, cybersecurity teams, journalists, businesses, and researchers analyze publicly available information. It combines phone intelligence, vehicle intelligence, AI-powered investigation workflows, and REST APIs into a single enterprise platform.',
  },
  {
    q: 'What intelligence can I search?',
    a: 'Huntme allows you to investigate publicly available information related to: Phone Numbers, Vehicle Registration Numbers, Connected Public Records, Email Addresses, Related Entities, Risk Indicators, Investigation Timelines, and AI Relationship Analysis.',
  },
  {
    q: 'Is the data legal to access?',
    a: 'Yes. Huntme is designed to work with publicly available information and authorized data sources. The platform is intended for lawful investigations, cybersecurity research, fraud prevention, due diligence, and compliance purposes.',
  },
  {
    q: 'How accurate are the investigation results?',
    a: 'Each investigation includes an AI-generated Confidence Score based on source reliability, data consistency, and entity correlation to help analysts evaluate the reliability of findings.',
  },
  {
    q: 'Who is Huntme built for?',
    a: 'Huntme is designed for Cybersecurity Teams, Law Enforcement Agencies, Licensed Investigators, Journalists, Fraud Investigation Teams, and OSINT Researchers.',
  },
  {
    q: 'Does Huntme provide an API?',
    a: 'Yes. Our Developer REST API provides secure endpoints with Bearer Authentication, allowing developers to integrate phone and vehicle intelligence directly into their own applications.',
  },
];

export default function Home() {
  const softwareSchema = getSoftwareAppSchema();
  const faqSchema = getFaqSchema(homepageFaqs);

  return (
    <>
      <JsonLd data={softwareSchema} />
      <JsonLd data={faqSchema} />
      <DemoOne />
    </>
  );
}
