import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Mail, Phone } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa6";
import { toast } from "sonner";
import { FaTiktok } from "react-icons/fa";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    toast.success("Message sent! We'll get back to you soon.");
  };

  return (
    <div className="py-16 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-4xl md:text-5xl font-black text-foreground mb-4">
          Contact Us
        </h1>
        <p className="font-body text-muted-foreground mb-12 text-base">
          Have a question or want to place a custom order? We'd love to hear
          from you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="font-body text-sm">Your Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label className="font-body text-sm">Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label className="font-body text-sm">Message</Label>
              <Textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                required
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              disabled={sent}
              className="w-full bg-foreground text-background hover:opacity-90 font-body font-semibold py-6 rounded-full text-sm"
            >
              {sent ? "Message Sent!" : "SEND MESSAGE"}
            </Button>
          </form>

          {/* Info */}
          <div className="space-y-8">
            <div>
              <h3 className="font-heading text-xl font-bold mb-4">
                Get In Touch
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 font-body text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 text-foreground flex-shrink-0" />
                  <span>hello@gourmettwist.com</span>
                </div>
                <div className="flex items-center gap-3 font-body text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 text-foreground flex-shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/tiara_breadhub/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
                >
                  {/* <FaInstagram className="w-4 h-4" /> */}
                  <FaInstagram className="w-4 h-4 text-purple-500" />
                  {/* <Instagram className="w-4 h-4" /> */}
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
                >
                  {/* <Facebook className="w-4 h-4" /> */}{" "}
                  <FaFacebook className="w-4 h-4 text-[#1877F2]" />
                </a>
                <a
                  href="https://www.tiktok.com/@tiarasbreadhub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
                >
                  <FaTiktok className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
