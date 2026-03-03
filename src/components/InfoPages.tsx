import React from 'react';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';

interface InfoPageProps {
  eyebrow: string;
  title: string;
  updated?: string;
  children: React.ReactNode;
}

export function InfoPage({ eyebrow, title, updated, children }: InfoPageProps) {
  return (
    <div className="bg-horizon min-h-screen pt-[72px]">
      <div className="max-w-[680px] mx-auto px-7 pt-[60px] pb-24">
        <div className="text-[7.5px] tracking-[0.6em] uppercase text-mist opacity-[0.18] mb-[22px]">{eyebrow}</div>
        <h1 className="font-serif font-light text-[clamp(2rem,4vw,3.2rem)] tracking-[0.01em] leading-[1.1] text-mist mb-12">{title}</h1>
        {updated && <div className="text-[8px] tracking-[0.35em] text-mist opacity-[0.18] -mt-9 mb-11">{updated}</div>}
        <div className="text-[11.5px] leading-[2] tracking-[0.06em] text-mist opacity-[0.38]">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export function InfoForm({ children }: { children: React.ReactNode }) {
  return <div className="mt-10 flex flex-col gap-[22px]">{children}</div>;
}

export function InfoInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="w-full border-b border-[rgba(240,237,232,0.45)] py-3 text-[11px] tracking-[0.18em] text-mist opacity-70 font-light bg-transparent outline-none focus:border-[rgba(240,237,232,0.75)] focus:opacity-100 placeholder:opacity-60 placeholder:text-[9.5px] placeholder:tracking-[0.3em] transition-colors"
      {...props}
    />
  );
}

export function InfoSubmit({ children }: { children: React.ReactNode }) {
  return (
    <button className="self-start mt-2 px-8 py-[15px] border border-[rgba(240,237,232,0.55)] text-[8.5px] tracking-[0.5em] uppercase text-mist opacity-75 bg-transparent transition-all hover:opacity-100 hover:bg-mist hover:text-horizon">
      {children}
    </button>
  );
}

// Track Order Page
export function TrackPage() {
  return (
    <InfoPage eyebrow="Customer Care" title="Track Your Order">
      <p>Enter your order number and email address to view the status of your order.</p>
      <InfoForm>
        <InfoInput type="text" placeholder="Order number" />
        <InfoInput type="email" placeholder="Email address" />
        <InfoSubmit>Track Order</InfoSubmit>
      </InfoForm>
    </InfoPage>
  );
}

// Returns Page
export function ReturnsPage() {
  return (
    <InfoPage eyebrow="Customer Care" title="Start A Return">
      <p>Items may be returned within 10 days of receipt in unworn, original condition. Flux (made-to-measure) orders are final sale.</p>
      <p className="mt-4">Enter your order details to begin.</p>
      <InfoForm>
        <InfoInput type="text" placeholder="Order number" />
        <InfoInput type="email" placeholder="Email address" />
        <InfoSubmit>Begin Return</InfoSubmit>
      </InfoForm>
    </InfoPage>
  );
}

// Contact Page
export function ContactPage() {
  return (
    <InfoPage eyebrow="Contact" title="Get in Touch">
      <p>For general inquiries, styling, or press — <a href="mailto:deborah@piscesrising.world" className="border-b border-[rgba(240,237,232,0.2)] hover:border-[rgba(240,237,232,0.6)] transition-colors">deborah@piscesrising.world</a></p>
      <p className="mt-5">(917) 524-9665</p>
    </InfoPage>
  );
}

// Privacy Page
export function PrivacyPage() {
  return (
    <InfoPage eyebrow="Legal" title="Privacy Notice" updated="Last updated: February 2026">
      <p>This notice describes how Pisces Rising collects, uses, and protects your personal information when you visit our site or make a purchase.</p>
      <h2 className="font-serif font-light text-[1.25rem] tracking-[0.05em] text-mist opacity-70 mt-10 mb-3">Information We Collect</h2>
      <p>We collect information you provide when placing an order: name, email, shipping address, and payment details. We also collect standard browsing data via analytics tools.</p>
      <h2 className="font-serif font-light text-[1.25rem] tracking-[0.05em] text-mist opacity-70 mt-10 mb-3">How We Use It</h2>
      <p>To process and fulfill orders. To communicate with you about your purchase. To improve our site and services. We do not sell your personal information.</p>
      <h2 className="font-serif font-light text-[1.25rem] tracking-[0.05em] text-mist opacity-70 mt-10 mb-3">Your Rights</h2>
      <p>You may request access to, correction of, or deletion of your data at any time. Contact <a href="mailto:deborah@piscesrising.world" className="border-b border-[rgba(240,237,232,0.2)]">deborah@piscesrising.world</a>.</p>
    </InfoPage>
  );
}

// Terms Page
export function TermsPage() {
  return (
    <InfoPage eyebrow="Legal" title="Terms of Use" updated="Last updated: February 2026">
      <p>By accessing this site you agree to the following terms. Please read them carefully.</p>
      <h2 className="font-serif font-light text-[1.25rem] tracking-[0.05em] text-mist opacity-70 mt-10 mb-3">Use of Site</h2>
      <p>This site is for personal, non-commercial use only. You may not reproduce, distribute, or create derivative works from any content without express written permission from Pisces Rising.</p>
      <h2 className="font-serif font-light text-[1.25rem] tracking-[0.05em] text-mist opacity-70 mt-10 mb-3">Intellectual Property</h2>
      <p>All content — including images, design, and copy — is the property of Pisces Rising. All rights reserved.</p>
      <h2 className="font-serif font-light text-[1.25rem] tracking-[0.05em] text-mist opacity-70 mt-10 mb-3">Purchases</h2>
      <p>All prices are in USD. We reserve the right to refuse or cancel any order. Flux orders are final sale. Standard items may be returned within 10 days of receipt.</p>
    </InfoPage>
  );
}

// Accessibility Page
export function AccessibilityPage() {
  return (
    <InfoPage eyebrow="Legal" title="Accessibility">
      <p>Pisces Rising is committed to ensuring our digital experience is accessible to everyone, including people with disabilities.</p>
      <p className="mt-4">We are continuously working to improve the accessibility of this site in accordance with WCAG guidelines.</p>
      <p className="mt-4">If you encounter any barriers or require assistance, please contact us: <a href="mailto:deborah@piscesrising.world" className="border-b border-[rgba(240,237,232,0.2)]">deborah@piscesrising.world</a></p>
    </InfoPage>
  );
}

// Privacy Choices Page
export function PrivacyChoicesPage() {
  return (
    <InfoPage eyebrow="Legal" title="Your Privacy Choices">
      <p>Under the California Consumer Privacy Act (CCPA) and other applicable laws, you have the right to opt out of the sale or sharing of your personal information.</p>
      <p className="mt-4">Pisces Rising does not sell your personal data to third parties. If you have questions about how your information is used, or to exercise your rights, please contact us.</p>
      <InfoForm>
        <InfoSubmit>Do Not Sell or Share My Personal Information</InfoSubmit>
      </InfoForm>
    </InfoPage>
  );
}
