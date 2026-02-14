import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Shield, Users, Award, Car, CheckCircle, MapPin } from "lucide-react";

const values = [
  { icon: Shield, title: "Trust & Transparency", desc: "Every car comes with complete documentation and honest pricing — no hidden costs." },
  { icon: Users, title: "Customer First", desc: "We build lasting relationships by treating every customer like family." },
  { icon: Award, title: "Quality Assured", desc: "Each vehicle is thoroughly inspected and certified before listing." },
  { icon: Car, title: "Wide Selection", desc: "From hatchbacks to SUVs — find the perfect car for your needs and budget." },
];

const whyUs = [
  "Multi-point quality inspection on every vehicle",
  "Transparent pricing with no hidden charges",
  "Complete RTO documentation assistance",
  "Flexible financing options available",
  "Post-sale support and service guidance",
  "Genuine odometer and accident history disclosure",
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
          Hyderabad's trusted destination for quality pre-owned cars. We believe in honest deals, transparent processes, and building relationships that last beyond the sale.
        </motion.p>
      </div>
    </section>

    {/* Our Story */}
    <section className="container mx-auto px-4 py-16">
      <div className="grid gap-12 md:grid-cols-2 items-center">
        <div>
          <h2 className="font-heading text-3xl font-bold text-foreground">Our Story</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Ashok Reddy Cars was founded with a simple mission — to make buying a pre-owned car a stress-free, trustworthy experience. Located in the heart of Kukatpally, Hyderabad, we have served hundreds of happy customers with quality vehicles at honest prices.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            With years of experience in the automotive industry, we understand what matters most to buyers: reliability, transparency, and value. That's why every car in our showroom goes through a rigorous inspection process before it reaches you.
          </p>
          <div className="mt-6 flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-4">
            <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              Nandhu Nandhini Building, Mahankali Nagar, Shamshiguda, Kukatpally, Hyderabad, Telangana 500072
            </p>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden shadow-card border border-border">
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

    {/* Values */}
    <section className="bg-muted/50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl font-bold text-foreground text-center">Our Values</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-6 shadow-card text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full hero-gradient">
                <v.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="container mx-auto px-4 py-16">
      <h2 className="font-heading text-3xl font-bold text-foreground text-center">Why Choose Us</h2>
      <div className="mt-10 max-w-2xl mx-auto grid gap-4">
        {whyUs.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-card"
          >
            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
            <p className="text-foreground">{item}</p>
          </motion.div>
        ))}
      </div>
    </section>

    <Footer />
  </div>
);

export default About;
