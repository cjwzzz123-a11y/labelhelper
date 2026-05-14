import { FAQ, type FAQItem } from "@/components/FAQ";

const homeFaqItems: FAQItem[] = [
  {
    question: "What is Shipping Label Helper for?",
    answer: "Shipping Label Helper is a browser-based toolkit for small ecommerce sellers who need to check shipping label size, print scale, paper setup, PDF page size and barcode quiet zones before printing paid postage.",
  },
  {
    question: "Which platforms and label formats does it support?",
    answer: "The current tools focus on common ecommerce and carrier workflows for Etsy, Shopify, eBay, USPS, UPS, FedEx, DHL, Royal Mail, Canada Post and Australia Post, with templates and checks for 4x6, A4, Letter and related label layouts.",
  },
  {
    question: "Do my PDF files upload to a server?",
    answer: "The PDF tools are designed to process files in your browser. Your label PDFs are not uploaded to our server for analysis or conversion.",
  },
  {
    question: "How do I buy Pro Toolkit and receive my license?",
    answer: "The pricing page links to Creem checkout when the product checkout URL is configured. After purchase, the license key or activation code is used on the unlock page to enable paid Pro Toolkit features.",
  },
  {
    question: "What if I lose my license key or do not receive the email?",
    answer: "First check your spam or promotions folder. If you still cannot find it, contact support@labelhelper.com with your purchase email and Creem order number.",
  },
  {
    question: "Can I request a refund?",
    answer: "Yes. The refund window is 14 days from purchase. A full refund is available before the license key has been used to unlock paid features. See /refunds for the complete policy.",
  },
  {
    question: "How many users can use one license key?",
    answer: "One Pro Toolkit license is for one user. License keys may not be resold, shared publicly or used as a shared team credential unless a separate plan explicitly allows it.",
  },
  {
    question: "What if my carrier, marketplace or file format is not supported?",
    answer: "Use the free checks and templates where they fit, and contact support@labelhelper.com with the unsupported platform, carrier, paper size and a description of the issue. Do not send sensitive label files unless support specifically asks for an example.",
  },
];

export function HomeFaq() {
  return <FAQ heading="Frequently asked questions" items={homeFaqItems} />;
}
