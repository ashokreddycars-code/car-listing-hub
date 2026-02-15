import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Shield, Users, Award, Car, CheckCircle, MapPin, Phone, Star, Heart, Handshake, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const values = [
  { icon: Shield, title: "Trust & Transparency", desc: "Every car comes with complete documentation and honest pricing — no hidden costs, ever." },
  { icon: Users, title: "Customer First", desc: "We build lasting relationships by treating every customer like family. Your satisfaction is our priority." },
  { icon: Award, title: "Quality Assured", desc: "Each vehicle is thoroughly inspected and certified before listing in our showroom." },
  { icon: Car, title: "Wide Selection", desc: "From hatchbacks to SUVs — find the perfect car for your needs and budget." },
  { icon: Heart, title: "Passion for Cars", desc: "Cars are not just business for us — they're our passion. We hand-pick only the best for you." },
  { icon: Handshake, title: "Honest Deals", desc: "What you see is what you get. No surprises, no gimmicks — just fair and honest deals." },
];

const whyUs = [
  "Multi-point quality inspection on every vehicle",
  "Transparent pricing with no hidden charges",
  "Complete RTO documentation and transfer assistance",
  "Flexible financing options available",
  "Post-sale support and service guidance",
  "Genuine odometer and accident history disclosure",
  "Insurance transfer and renewal assistance",
  "Test drive facility available at showroom",
];

const milestones = [
  { year: "2014", event: "Started operations in Kukatpally, Hyderabad" },
  { year: "2017", event: "Crossed 100+ satisfied customers" },
  { year: "2020", event: "Expanded showroom with larger display space" },
  { year: "2023", event: "500+ cars sold with 4.8★ rating" },
  { year: "2026", event: "Hyderabad's most trusted pre-owned car destination" },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <section className="relative pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 hero-gradient opacity-5" />
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-4xl font-bold text-foreground md:text-5xl"
        >
          About <span className="text-gradient">Ashok Reddy Cars</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground"
        >
          Hyderabad's trusted destination for quality pre-owned cars since 2014. We believe in honest deals, transparent processes, and building relationships that last beyond the sale.
        </motion.p>
      </div>
    </section>

    {/* Our Story */}
    <section className="container mx-auto px-4 py-16">
      <div className="grid gap-12 md:grid-cols-2 items-center">
        <div>
          <h2 className="font-heading text-3xl font-bold text-foreground">
            Our <span className="text-gradient">Story</span>
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Ashok Reddy Cars was founded with a simple mission — to make buying a pre-owned car a stress-free, trustworthy experience. Located in the heart of Kukatpally, Hyderabad, we have served hundreds of happy customers with quality vehicles at honest prices.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            With over a decade of experience in the automotive industry, we understand what matters most to buyers: reliability, transparency, and value. That's why every car in our showroom goes through a rigorous multi-point inspection process before it reaches you.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            We don't just sell cars — we build trust. From the moment you walk into our showroom to the day you drive away, we ensure every step of the process is smooth, transparent, and enjoyable.
          </p>
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-muted/50 p-4">
            <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              Nandhu Nandhini Building, Mahankali Nagar, Shamshiguda, Kukatpally, Hyderabad, Telangana 500072
            </p>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-card border border-border">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.0795988090067!2d78.40519599999999!3d17.503713299999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb910263c39411%3A0x47305d0373141a0d!2sAshok%20Reddy%20Cars!5e0!3m2!1sen!2sin!4v1771041881594!5m2!1sen!2sin"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ashok Reddy Cars location"
          />
        </div>
      </div>
    </section>

    {/* Milestones */}
    <section className="hero-gradient py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl font-bold text-primary-foreground text-center mb-10">Our Journey</h2>
        <div className="max-w-3xl mx-auto space-y-0">
          {milestones.map((m, i) => (
            <motion.div
              key={m.year}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 py-4 border-b border-primary-foreground/20 last:border-b-0"
            >
              <span className="font-heading text-2xl font-bold text-primary-foreground min-w-[80px]">{m.year}</span>
              <div className="h-3 w-3 rounded-full bg-primary-foreground flex-shrink-0" />
              <p className="text-primary-foreground/90">{m.event}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl font-bold text-foreground text-center">
          Our <span className="text-gradient">Values</span>
        </h2>
        <p className="mt-2 text-center text-muted-foreground">The principles that guide everything we do</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-card text-center hover:shadow-glow hover:border-primary/30 transition-all duration-300"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl hero-gradient">
                <v.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="bg-muted/50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl font-bold text-foreground text-center">
          Why Choose <span className="text-gradient">Us</span>
        </h2>
        <p className="mt-2 text-center text-muted-foreground">Here's what sets us apart from the rest</p>
        <div className="mt-10 max-w-3xl mx-auto grid gap-4 sm:grid-cols-2">
          {whyUs.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card"
            >
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
              <p className="text-foreground text-sm">{item}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="container mx-auto px-4 py-16 text-center">
      <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
        Ready to Visit <span className="text-gradient">Us?</span>
      </h2>
      <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
        Come see our collection in person. We're located in Kukatpally, Hyderabad and open 6 days a week.
      </p>
      <p className="mt-4 font-heading text-2xl font-bold text-primary">📞 9000 771 660</p>
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <a href="tel:+919000771660">
          <Button size="lg" className="hero-gradient text-primary-foreground font-semibold">
            <Phone className="mr-2 h-5 w-5" /> Call Now
          </Button>
        </a>
        <Link to="/contact">
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Contact Us
          </Button>
        </Link>
      </div>
    </section>

    <Footer />
  </div>
);

export default About;
