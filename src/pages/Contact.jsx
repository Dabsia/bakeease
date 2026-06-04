import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Mail, Phone } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa6";
import { toast } from "sonner";
import { FaTiktok } from "react-icons/fa";
import { API_URL } from "../lib/api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus(null);

    try {
      // Transform form data to match API expected format
      const emailData = {
        name: form.name,
        from: form.email,
        message: form.message,
      };

      console.log("Sending email data:", emailData);

      const response = await fetch(`${API_URL}/email/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || `Server responded with status ${response.status}`,
        );
      }

      // Success - show different feedback methods
      setSubmitStatus("success");
      toast.success(
        "✓ Message sent successfully! We'll get back to you soon.",
        {
          duration: 5000,
          position: "top-center",
        },
      );

      // Reset form
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      setSubmitStatus("error");
      toast.error(
        error.message || "Failed to send message. Please try again.",
        {
          duration: 5000,
          position: "top-center",
        },
      );
    } finally {
      setIsLoading(false);

      // Clear status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }
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

        {/* Status Message Banner */}
        {submitStatus === "success" && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-body text-sm">
              ✓ Message sent successfully! We'll get back to you soon.
            </p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-body text-sm">
              ✗ Failed to send message. Please try again or contact us directly.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="font-body text-sm">Your Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                disabled={isLoading}
                className="mt-1"
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label className="font-body text-sm">Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                disabled={isLoading}
                className="mt-1"
                placeholder="hello@example.com"
              />
            </div>
            <div>
              <Label className="font-body text-sm">Message</Label>
              <Textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                required
                disabled={isLoading}
                className="mt-1"
                placeholder="Type Message"
              />
            </div>

            {/* Submit Button with different states */}
            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full font-body font-semibold py-6 rounded-full text-sm transition-all ${
                submitStatus === "success"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : submitStatus === "error"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-foreground text-background hover:opacity-90"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  SENDING...
                </div>
              ) : submitStatus === "success" ? (
                "✓ MESSAGE SENT!"
              ) : submitStatus === "error" ? (
                "✗ FAILED - TRY AGAIN"
              ) : (
                "SEND MESSAGE"
              )}
            </Button>

            {/* Additional feedback text */}
            {submitStatus === "success" && (
              <p className="text-center text-green-600 text-sm font-body">
                Thank you for reaching out! We'll respond within 24 hours.
              </p>
            )}
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
                  <span>tiarasbeadhub@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 font-body text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 text-foreground flex-shrink-0" />
                  <span>+372 5379 0302</span>
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
                  <FaInstagram className="w-4 h-4 text-purple-500" />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61557920194244"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
                >
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
