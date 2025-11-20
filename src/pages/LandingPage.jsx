import React, { useState, useEffect, useRef } from "react";
import { Facebook, Twitter, Linkedin } from "lucide-react";

export default function ArsenicDetectLanding({
  onNavigateToRegister,
  onNavigateToLogin,
}) {
  const [isHovering, setIsHovering] = useState(false);
  const [counts, setCounts] = useState({
    images: 0,
    accuracy: 0,
    countries: 0,
  });

  const statsRef = useRef(null);
  const hasCounted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasCounted.current) {
          hasCounted.current = true;

          const targets = { images: 25000, accuracy: 95, countries: 120 };
          const duration = 2200;
          const steps = 60;
          const interval = duration / steps;

          let current = { images: 0, accuracy: 0, countries: 0 };

          const timer = setInterval(() => {
            current.images += targets.images / steps;
            current.accuracy += targets.accuracy / steps;
            current.countries += targets.countries / steps;

            setCounts({
              images: Math.min(Math.floor(current.images), targets.images),
              accuracy: Math.min(
                Number(current.accuracy.toFixed(1)),
                targets.accuracy
              ),
              countries: Math.min(
                Math.round(current.countries),
                targets.countries
              ),
            });

            if (
              current.images >= targets.images &&
              current.accuracy >= targets.accuracy &&
              current.countries >= targets.countries
            ) {
              clearInterval(timer);
              setCounts(targets); // Final exact values
            }
          }, interval);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.7, rootMargin: "0px 0px -100px 0px" }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-green-50">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              ArsenicDetect
            </h1>
            <p className="text-sm text-gray-600">
              Image-based Arsenic Detection
            </p>
          </div>
          <nav>
            <ul className="flex space-x-8 text-gray-700 font-medium">
              <li>
                <a href="#" className="hover:text-emerald-600 transition">
                  Home
                </a>
              </li>
              <li>
                <button
                  onClick={onNavigateToLogin}
                  className="hover:text-emerald-600 transition cursor-pointer"
                >
                  Login
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateToRegister}
                  className="hover:text-emerald-600 transition cursor-pointer"
                >
                  Register
                </button>
              </li>
              <li>
                <a href="#about" className="hover:text-emerald-600 transition">
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-emerald-600 transition"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
              Advanced{" "}
              <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Arsenic Detection
              </span>{" "}
              Through Image Processing
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Upload your water test strip image and get instant, accurate
              results powered by AI.
            </p>
            <button
              onClick={onNavigateToLogin}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="group relative inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <span>Get Started Now</span>
              <svg
                className={`w-6 h-6 ml-3 transition-transform ${
                  isHovering ? "translate-x-2" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
          <div className="flex justify-center">
            <div className="p-2">
              <img
                src="/drop.gif"
                alt="Water test"
                className="w-[400px] rounded-xl border-white/60"
              />
            </div>
          </div>
        </div>

        {/* Animated Stats - NOW FULLY WORKING */}
        <div
          ref={statsRef}
          className="grid sm:grid-cols-3 gap-10 mt-32 pt-20 border-t border-white"
        >
          {[
            { value: counts.images, label: "Images Analyzed", suffix: "+" },
            { value: counts.accuracy, label: "Model Accuracy", suffix: "%" },
            {
              value: counts.countries,
              label: "Countries Reached",
              suffix: "+",
            },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                {stat.value.toLocaleString("en-US")}
                <span className="text-4xl lg:text-5xl ml-1 text-emerald-600">
                  {stat.suffix}
                </span>
              </div>
              <p className="text-xl text-gray-700 mt-4 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="relative z-10 bg-white/70 backdrop-blur-md py-20 border-t border-white/20"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-14">
            How It Works
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "📸",
                title: "Capture Image",
                text: "Take a clean photo of the water test strip.",
              },
              {
                icon: "⬆️",
                title: "Upload Image",
                text: "Upload safely to our secure server.",
              },
              {
                icon: "🧠",
                title: "AI Analysis",
                text: "Deep learning model processes the image.",
              },
              {
                icon: "📊",
                title: "Get Results",
                text: "See accurate arsenic levels instantly.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/80 p-6 rounded-2xl shadow hover:shadow-xl transition"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600 mt-2">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-10">Contact Us</h2>

          <form className="grid gap-6">
            <input
              type="text"
              placeholder="Your Name"
              className="p-4 bg-white/70 backdrop-blur rounded-xl shadow focus:outline-none"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="p-4 bg-white/70 backdrop-blur rounded-xl shadow focus:outline-none"
            />

            <textarea
              placeholder="Your Message"
              className="p-4 h-32 bg-white/70 backdrop-blur rounded-xl shadow focus:outline-none"
            />

            <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-500 text-white text-lg font-semibold rounded-xl shadow hover:shadow-xl cursor-pointer transition transform hover:scale-105">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white/80 backdrop-blur-md border-t border-white/20 py-6">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <p className="text-gray-600">
            © 2025 ArsenicDetect. All rights reserved.
          </p>

          <div className="flex space-x-4 text-xl text-gray-700">
            <a href="#" className="hover:text-blue-600 transition">
              <Facebook size={24} />
            </a>

            <a href="#" className="hover:text-blue-400 transition">
              <Twitter size={24} />
            </a>

            <a href="#" className="hover:text-blue-700 transition">
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 30px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 12s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
