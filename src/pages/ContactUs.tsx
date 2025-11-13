import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function ContactPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);

    // Simulate API submission
    await new Promise((r) => setTimeout(r, 1000));
    alert("Thank you for contacting SafeTrack! We'll get back to you shortly.");
    navigate("/");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          padding: "40px 36px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
            <Logo size={36} />
            <span style={{ fontSize: "1.4em", fontWeight: 700, color: "#1E293B" }}>
              SafeTrack<span style={{ color: "#2563EB" }}>™</span>
            </span>
          </div>
          <h1 style={{ marginTop: "18px", fontSize: "1.8em", fontWeight: 700, color: "#1E293B" }}>
            Contact Us
          </h1>
          <p style={{ color: "#475569", fontSize: "1em", marginTop: "6px" }}>
            We’d love to hear from you. Reach out with any questions, feedback, or partnership inquiries.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "0.9em", fontWeight: 600, color: "#334155" }}>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Jane Doe"
              style={{
                marginTop: "6px",
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                outline: "none",
                fontSize: "0.95em",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.9em", fontWeight: 600, color: "#334155" }}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@company.com"
              style={{
                marginTop: "6px",
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                outline: "none",
                fontSize: "0.95em",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.9em", fontWeight: 600, color: "#334155" }}>Subject</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              placeholder="General Inquiry"
              style={{
                marginTop: "6px",
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                outline: "none",
                fontSize: "0.95em",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.9em", fontWeight: 600, color: "#334155" }}>Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="How can we help you?"
              rows={5}
              style={{
                marginTop: "6px",
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                outline: "none",
                fontSize: "0.95em",
                resize: "none",
              }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitted}
            style={{
              marginTop: "10px",
              padding: "12px 24px",
              width: "100%",
              background: submitted ? "#60A5FA" : "#2563EB",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1em",
              fontWeight: 600,
              cursor: submitted ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => !submitted && (e.currentTarget.style.background = "#1E40AF")}
            onMouseOut={(e) => !submitted && (e.currentTarget.style.background = "#2563EB")}
          >
            {submitted ? "Sending..." : "Send Message"}
          </button>
        </form>

        {/* Footer */}
        <p
          style={{
            marginTop: "24px",
            textAlign: "center",
            fontSize: "0.9em",
            color: "#475569",
          }}
        >
          Prefer to talk directly?{" "}
          <span
            onClick={() => navigate("/chat")}
            style={{
              color: "#2563EB",
              cursor: "pointer",
              fontWeight: 500,
              textDecoration: "underline",
            }}
          >
            Chat with our support team
          </span>
          .
        </p>
      </div>
    </div>
  );
}
