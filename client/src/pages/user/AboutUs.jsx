import Sidebar from "../../components/user/Sidebar";

import FeatureCard from "../../components/user/aboutUs/FeatureCard";
import ValueItem from "../../components/user/aboutUs/ValueItem";
import ContactCard from "../../components/user/aboutUs/ContactCard";

import {
  Globe,
  ShieldCheck,
  Heart,
  BookOpen,
  Users,
  CheckCircle,
  Lightbulb,
  Award,
} from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen flex bg-[#FFFBF7]">
      <Sidebar />

      <main className="flex-1 px-8 py-10">
        <div className="max-w-5xl mx-auto">

          {/* Heading */}

          <h1 className="text-5xl font-extrabold text-center text-[#1B1B2F]">
            About CargoConnect
          </h1>

          {/* Story */}

          <section className="mt-12">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-full bg-[#FFF1EA] flex items-center justify-center">
                <BookOpen className="text-[#E8734A]" />
              </div>

              <h2 className="text-3xl font-bold text-[#1B1B2F]">
                Our Story
              </h2>

            </div>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Founded in 2015, CargoConnect was created with one simple goal:
              making courier services faster, smarter and more reliable.
              What began as a small local delivery service has grown into a
              trusted logistics platform powered by technology, dedicated
              professionals and customer-first service.
            </p>

          </section>

          {/* Features */}

          <section className="grid md:grid-cols-3 gap-8 mt-12">

            <FeatureCard
              icon={<Globe className="text-[#E8734A]" />}
              title="Reliability"
              description="We treat every package with care, ensuring secure, safe and on-time deliveries across the country."
            />

            <FeatureCard
              icon={<Award className="text-[#E8734A]" />}
              title="Technology"
              description="Our smart tracking platform provides real-time updates so customers always know where their parcel is."
            />

            <FeatureCard
              icon={<Heart className="text-[#E8734A]" />}
              title="Sustainability"
              description="We continuously invest in eco-friendly transportation and packaging to reduce our environmental impact."
            />

          </section>

          {/* Core Values */}

          <section className="mt-16">

            <div className="flex items-center gap-4 mb-8">

              <div className="w-12 h-12 rounded-full bg-[#FFF1EA] flex items-center justify-center">
                <Users className="text-[#E8734A]" />
              </div>

              <h2 className="text-3xl font-bold text-[#1B1B2F]">
                Our Core Values
              </h2>

            </div>

            <div className="space-y-6">

              <ValueItem
                icon={<Users className="text-[#E8734A]" size={20} />}
                title="Customer First"
                description="Every decision we make starts with delivering the best experience for our customers."
              />

              <ValueItem
                icon={<CheckCircle className="text-[#E8734A]" size={20} />}
                title="Integrity"
                description="We believe in transparency, honesty and accountability in every delivery."
              />

              <ValueItem
                icon={<Lightbulb className="text-[#E8734A]" size={20} />}
                title="Innovation"
                description="We continuously improve our technology and services to provide a smarter courier experience."
              />

              <ValueItem
                icon={<ShieldCheck className="text-[#E8734A]" size={20} />}
                title="Respect"
                description="We value our customers, employees and partners while building lasting relationships."
              />

            </div>

          </section>

          {/* Contact */}

          <ContactCard />

        </div>
      </main>
    </div>
  );
}