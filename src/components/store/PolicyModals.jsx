import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const policies = {
  refund: {
    title: "Refund Policy",
    content: [
      {
        heading: "Our Commitment",
        body: "At GourmetTwist, your satisfaction is our top priority. We stand behind the quality of every loaf we bake. If you're not completely happy with your order, we want to make it right.",
      },
      {
        heading: "1. Eligibility for Refunds",
        body: "Refund requests must be made within 48 hours of receiving your order. To be eligible, your item must be unused, uneaten, and in the same condition you received it. We also require proof of purchase and a photo of the product.",
      },
      {
        heading: "2. Non-Refundable Items",
        body: "Due to the perishable nature of our baked goods, we cannot accept returns on partially consumed products. Gift cards and downloadable items are also non-refundable.",
      },
      {
        heading: "3. Damaged or Incorrect Orders",
        body: "If you received a damaged or wrong item, please contact us immediately at hello@gourmettwist.com with a photo. We will send a replacement at no extra charge or issue a full refund.",
      },
      {
        heading: "4. Processing Refunds",
        body: "Once your refund is approved, it will be processed within 5–7 business days. The credit will be applied to your original payment method.",
      },
      {
        heading: "5. Contact Us",
        body: "For any refund-related questions, please reach out to us at hello@gourmettwist.com or call +1 (555) 123-4567.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    content: [
      {
        heading: "Introduction",
        body: "GourmetTwist is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or make a purchase.",
      },
      {
        heading: "1. Information We Collect",
        body: "We collect information you provide directly to us, such as your name, email address, shipping address, and payment details when you place an order. We also collect browsing data automatically through cookies.",
      },
      {
        heading: "2. How We Use Your Information",
        body: "We use your information to process orders, send order confirmations and shipping updates, respond to customer service inquiries, and improve our website and offerings.",
      },
      {
        heading: "3. Sharing Your Information",
        body: "We do not sell or rent your personal information to third parties. We may share data with trusted service providers (e.g., payment processors, shipping carriers) solely to fulfil your orders.",
      },
      {
        heading: "4. Cookies",
        body: "Our website uses cookies to enhance your browsing experience, remember your cart contents, and analyse site traffic. You can disable cookies in your browser settings, though some features may not function properly.",
      },
      {
        heading: "5. Data Security",
        body: "We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.",
      },
      {
        heading: "6. Contact Us",
        body: "If you have questions about this Privacy Policy, contact us at hello@gourmettwist.com.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    content: [
      {
        heading: "Introduction",
        body: "Thank you for choosing GourmetTwist. These terms and conditions outline the rules and regulations for the use of our website and services. By accessing this website, you accept these terms and conditions in full. Please do not continue to use GourmetTwist's website if you do not accept all of the terms and conditions stated on this page.",
      },
      {
        heading: "1. User Agreement",
        body: "By using our website and making purchases, you affirm that you are at least 18 years old or visiting the site under the supervision of an adult or guardian. You also agree to comply with all applicable laws and regulations regarding online conduct and acceptable content.",
      },
      {
        heading: "2. Online Sales and Transactions",
        body: "We offer a range of banana bread products through our online store. All transactions are subject to our Refund and Replacement Policy, which outlines the conditions for refunds or replacements. We reserve the right to refuse service to anyone and to cancel orders at our discretion.",
      },
      {
        heading: "3. Product Information and Availability",
        body: "We strive to present the most accurate and up-to-date product information on our website. However, there may be instances where product details, pricing, or availability are not current. We reserve the right to modify product details without prior notice.",
      },
      {
        heading: "4. Intellectual Property",
        body: "All content on this website, including text, graphics, logos, and images, is the property of GourmetTwist and is protected by applicable intellectual property laws. You may not reproduce or distribute any content without our prior written permission.",
      },
      {
        heading: "5. Limitation of Liability",
        body: "GourmetTwist shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our liability is limited to the amount paid for the product in question.",
      },
      {
        heading: "6. Changes to Terms",
        body: "We reserve the right to update these terms at any time. Continued use of our website after changes constitutes acceptance of the revised terms.",
      },
    ],
  },
};

export default function PolicyModals({ open, onClose }) {
  if (!open) return null;
  const policy = policies[open];

  return (
    <Dialog open={!!open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl font-bold">
            {policy.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 mt-2">
          {policy.content.map((section, i) => (
            <div key={i}>
              <h3 className="font-body font-bold text-sm text-foreground mb-1">
                {section.heading}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
