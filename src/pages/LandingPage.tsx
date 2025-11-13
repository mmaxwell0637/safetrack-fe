import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: "#f5f7fa", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      {/* I remove my Navigation Bar and put it in your component */}


      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
          color: "white",
          padding: "100px 20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "3.2em", marginBottom: "20px", fontWeight: 800 }}>
          SafeTrack<span style={{ color: "#BFDBFE" }}>™</span>
        </h1>
        <p style={{ fontSize: "1.4em", marginBottom: "10px", opacity: 0.95 }}>
          Modern IT Support & Help Desk Solution
        </p>
        <p style={{ fontSize: "1.1em", marginBottom: "50px", opacity: 0.9 }}>
          Real-time tracking • Live chat • Transparent communication
        </p>
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "14px 45px",
            fontSize: "1.1em",
            background: "white",
            color: "#2563EB",
            border: "none",
            borderRadius: "999px",
            cursor: "pointer",
            fontWeight: 600,
            boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
            transition: "transform 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Get Started →
        </button>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "90px 20px", maxWidth: "1200px", margin: "0 auto" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: "2.3em",
            marginBottom: "50px",
            color: "#1E293B",
            fontWeight: 700,
          }}
        >
          Why Choose SafeTrack<span style={{ color: "#2563EB" }}>™</span>?
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "40px",
          }}
        >
          <FeatureCard icon="🎯" title="Real-Time Tracking" description="Monitor ticket progress with live updates and instant notifications" />
          <FeatureCard icon="💬" title="Live Chat Support" description="Communicate directly with technicians in real-time" />
          <FeatureCard icon="📊" title="Analytics Dashboard" description="Comprehensive reporting and performance metrics" />
          <FeatureCard icon="🔒" title="Secure & Compliant" description="Enterprise-grade security with full audit trails" />
          <FeatureCard icon="⚡" title="Fast Response" description="Automated routing and SLA management" />
          <FeatureCard icon="📱" title="Mobile Friendly" description="Access from anywhere, on any device" />
        </div>
      </section>

      {/* Team */}
      <section id="team" style={{ padding: "90px 20px", background: "#f1f5f9", textAlign: "center" }}>
        <h2 style={{ fontSize: "2.3em", marginBottom: "15px", color: "#1E293B", fontWeight: 700 }}>
          Meet Our Team
        </h2>
        <p style={{ fontSize: "1.1em", color: "#475569", marginBottom: "50px" }}>
          Monroe University – IT495 Senior Seminar Group 1
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "30px",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <TeamMember name="Malika Maxwell" role="Project Manager" />
          <TeamMember name="Ashley Pearson" role="Business Analyst" />
          <TeamMember name="Alcee Bernard" role="UI/UX Designer" />
          <TeamMember name="Jason Andrew" role="Frontend Developer" />
          <TeamMember name="Keron Matthews" role="Backend Developer" />
          <TeamMember name="Jaylon Scott" role="DevOps Engineer" />
          <TeamMember name="Tasondra Laureano" role="QA Engineer" />
          <TeamMember name="Shamakia Walker" role="Documentation" />
        </div>
      </section>

      {/* Services */}
      <section id="services" style={{ padding: "90px 20px", maxWidth: "1200px", margin: "0 auto" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: "2.3em",
            marginBottom: "50px",
            color: "#1E293B",
            fontWeight: 700,
          }}
        >
          Our Services
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "30px",
          }}
        >
          <ServiceCard
            title="Ticket Management"
            description="Create, track, and resolve support tickets with ease. Automated routing ensures tickets reach the right team member."
            features={["Automated routing", "Priority management", "Status tracking", "Email notifications"]}
          />
          <ServiceCard
            title="Customer Portal"
            description="Self-service portal for customers to submit tickets, track progress, and access support resources."
            features={["24/7 access", "Ticket history", "Live chat", "Knowledge base"]}
          />
          <ServiceCard
            title="Admin Dashboard"
            description="Comprehensive management tools for administrators to oversee operations and manage users."
            features={["User management", "Performance analytics", "SLA monitoring", "Audit logs"]}
          />
        </div>
      </section>
            {/*Trusted By Section */}
      <section
        id="trusted"
        style={{
          background: "#f8fafc",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "2em",
            fontWeight: 700,
            color: "#1E293B",
            marginBottom: "20px",
          }}
        >
          Trusted by Leading Organizations
        </h2>
        <p
          style={{
            color: "#64748b",
            maxWidth: "600px",
            margin: "0 auto 40px",
            fontSize: "1.1em",
          }}
        >
          SafeTrack powers support and security workflows for companies that value
          reliability and speed.
        </p>

        {/* Company Logos */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "40px",
            opacity: 0.9,
          }}
        >
          {/* These can be replaced with real client logos */}
          {["Microsoft", "Amazon", "Cisco", "Dell", "HP"].map((brand) => (
            <div
              key={brand}
              style={{
                fontSize: "1.3em",
                fontWeight: 600,
                color: "#475569",
                background: "white",
                padding: "12px 28px",
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              {brand}
            </div>
          ))}
        </div>
      </section>

      {/* 
        Testimonials Section
        */}
      <section
        id="testimonials"
        style={{
          padding: "80px 20px",
          textAlign: "center",
          background: "white",
        }}
      >
        <h2
          style={{
            fontSize: "2em",
            fontWeight: 700,
            color: "#1E293B",
            marginBottom: "20px",
          }}
        >
          What Our Clients Say
        </h2>
        <p
          style={{
            color: "#64748b",
            maxWidth: "600px",
            margin: "0 auto 40px",
            fontSize: "1.1em",
          }}
        >
          We take pride in helping organizations improve safety, communication, and
          performance every day.
        </p>

        {/* Testimonials Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {[
            {
              name: "Alex Rivera",
              title: "Operations Manager, LogiTech",
              quote:
                "SafeTrack streamlined our incident reporting process. We now resolve issues 2x faster than before!",
            },
            {
              name: "Jamie Lee",
              title: "Support Lead, FinSure",
              quote:
                "The dashboard and ticket tracking are intuitive. Our customer satisfaction has noticeably improved.",
            },
            {
              name: "Taylor Brooks",
              title: "IT Director, Nova Systems",
              quote:
                "Implementation was smooth and the team was incredibly responsive. SafeTrack is a game changer.",
            },
          ].map((t) => (
            <div
              key={t.name}
              style={{
                background: "#f8fafc",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "220px",
              }}
            >
              <p
                style={{
                  fontStyle: "italic",
                  color: "#334155",
                  lineHeight: "1.6",
                  marginBottom: "20px",
                }}
              >
                “{t.quote}”
              </p>
              <div>
                <strong style={{ color: "#1E293B", fontSize: "1em" }}>{t.name}</strong>
                <p style={{ color: "#64748b", fontSize: "0.9em" }}>{t.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* CTA */}
      <section
        style={{
          background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
          color: "white",
          padding: "50px 20px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "2.3em", marginBottom: "20px", fontWeight: 700 }}>
          Ready to Transform Your Support?
        </h2>
        <p style={{ fontSize: "1.2em", marginBottom: "40px", opacity: 0.9 }}>
          Join hundreds of teams already using SafeTrack™
        </p>
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "14px 60px",
            fontSize: "1.1em",
            background: "white",
            color: "#2563EB",
            border: "none",
            borderRadius: "999px",
            cursor: "pointer",
            fontWeight: 600,
            boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
            transition: "transform 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Start Free Trial
        </button>
      </section>
          <section
        style={{
          background: "#0F172A", // dark slate tone for cohesion
          color: "white",
          padding: "60px 20px 40px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "40px",
            alignItems: "start",
          }}
        >
          {/* Logo + Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              title="Back to top"
            >
              <Logo size={36} />
              <span style={{ fontSize: "1.4em", fontWeight: 700 }}>
                SafeTrack<span style={{ color: "#60A5FA" }}>™</span>
              </span>
            </div>
            <p style={{ maxWidth: "280px", color: "#CBD5E1", fontSize: "0.95em" }}>
              Empowering safer workplaces and streamlined support through technology.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{ fontSize: "1.1em", fontWeight: 600, marginBottom: "10px" }}>
              Explore
            </h4>
            <ul style={{ listStyle: "none", padding: 0, lineHeight: "2" }}>
              <li>
                <a
                  href="#features"
                  style={{ color: "#E2E8F0", textDecoration: "none" }}
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  style={{ color: "#E2E8F0", textDecoration: "none" }}
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#team"
                  style={{ color: "#E2E8F0", textDecoration: "none" }}
                >
                  Team
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  style={{ color: "#E2E8F0", textDecoration: "none" }}
                >
                  Testimonials
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info + Demo */}
          <div>
            <h4 style={{ fontSize: "1.1em", fontWeight: 600, marginBottom: "10px" }}>
              Contact Us
            </h4>
            <p style={{ margin: "6px 0", color: "#E2E8F0", fontSize: "0.95em" }}>
              📍 123 SafeTrack Blvd, Innovation City
            </p>
            <p style={{ margin: "6px 0", color: "#E2E8F0", fontSize: "0.95em" }}>
              📞 (800) 555-TRACK
            </p>
            <p style={{ margin: "6px 0", color: "#E2E8F0", fontSize: "0.95em" }}>
              ✉️ support@safetrack.com
            </p>

            <button
              onClick={() => (window.location.href = "/demo")}
              style={{
                marginTop: "10px",
                padding: "10px 24px",
                background: "#2563EB",
                color: "white",
                fontWeight: 600,
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#1E40AF")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#2563EB")}
            >
              Request a Demo
            </button>
          </div>
        </div>
      </section>
            {/* Footer */}
      <footer
        style={{
          background: "#1E293B",
          color: "white",
          padding: "50px 20px",
          textAlign: "center",
        }}
      >
        <p style={{ marginBottom: "10px", fontSize: "1.1em" }}>
          SafeTrack™ — Cloud-Based CRM & Help Desk Solution
        </p>
        <p style={{ opacity: 0.8, fontSize: "0.95em" }}>
          © 2025 Monroe University - IT495 Senior Seminar Group 1
        </p>
        <p
          style={{
            opacity: 0.7,
            marginTop: "10px",
            fontSize: "0.9em",
          }}
        >
          Instructor: Omolola Sanni
        </p>
      </footer>
    </div>
  );
}

/* Feature Card */
function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div
      style={{
        padding: "35px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        textAlign: "center",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)";
      }}
    >
      <div style={{ fontSize: "2.5em", marginBottom: "15px" }}>{icon}</div>
      <h3 style={{ fontSize: "1.2em", marginBottom: "10px", color: "#1E293B", fontWeight: 600 }}>{title}</h3>
      <p style={{ color: "#475569", lineHeight: "1.6" }}>{description}</p>
    </div>
  );
}

/* Team Member */
function TeamMember({ name, role }: { name: string; role: string }) {
  return (
    <div style={{ padding: "25px", background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
          margin: "0 auto 15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.8em",
          color: "white",
          fontWeight: 600,
        }}
      >
        {name.charAt(0)}
      </div>
      <h4 style={{ fontSize: "1.1em", color: "#1E293B", marginBottom: "5px" }}>{name}</h4>
      <p style={{ color: "#2563EB", fontSize: "0.9em", fontWeight: 500 }}>{role}</p>
    </div>
  );
}

/* Service Card */
function ServiceCard({ title, description, features }: { title: string; description: string; features: string[] }) {
  return (
    <div
      style={{
        padding: "35px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        border: "1px solid #e2e8f0",
      }}
    >
      <h3 style={{ fontSize: "1.4em", marginBottom: "15px", color: "#2563EB", fontWeight: 700 }}>{title}</h3>
      <p style={{ color: "#475569", marginBottom: "20px", lineHeight: "1.6" }}>{description}</p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {features.map((f, i) => (
          <li
            key={i}
            style={{
              padding: "8px 0",
              borderBottom: i < features.length - 1 ? "1px solid #E2E8F0" : "none",
            }}
          >
            ✓ {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
