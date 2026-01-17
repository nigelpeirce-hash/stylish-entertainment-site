import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/StylishEntertainment",
      icon: Facebook,
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/stylishentertainment/",
      icon: Instagram,
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@stylishentertainment937/playlists",
      icon: Youtube,
    },
  ];

  return (
    <footer className="bg-champagne-gold text-black py-6 sm:py-8 mt-0 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent backdrop-blur-md pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent backdrop-blur-sm pointer-events-none"></div>
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <h3 className="font-sans text-xl mb-4 font-bold" style={{ color: '#000000' }}>Stylish Entertainment</h3>
            <p className="text-black/80 mb-3">
              Professional DJs, live musicians, lighting design, and venue styling for weddings, parties, and corporate events. Strictly no YMCA.
            </p>
            <p className="text-black/80 mb-3">
              From <Link href="/artists/djs/" className="hover:text-black font-semibold underline transition-colors">expert DJs</Link> and <Link href="/artists/musicians/" className="hover:text-black font-semibold underline transition-colors">talented musicians</Link> to <Link href="/services/lighting-design/" className="hover:text-black font-semibold underline transition-colors">bespoke lighting design</Link> and <Link href="/services/venue-styling/" className="hover:text-black font-semibold underline transition-colors">venue transformations</Link>, we create unforgettable celebrations.
            </p>
            <p className="text-black/80">
              Complete your event with our <Link href="/hire/" className="hover:text-black font-semibold underline transition-colors">hire shop</Link> featuring decorative items, lighting, and styling accessories.
            </p>
          </div>
          <div>
            <h4 className="font-sans text-lg mb-4 font-bold" style={{ color: '#000000' }}>Quick Links</h4>
            <ul className="space-y-2 text-black/80">
              <li>
                <Link href="/artists/djs/" className="hover:text-black font-medium transition-colors">
                  Artists
                </Link>
              </li>
              <li>
                <Link href="/services/" className="hover:text-black font-medium transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/galleries/" className="hover:text-black font-medium transition-colors">
                  Galleries
                </Link>
              </li>
              <li>
                <Link href="/contact-us/" className="hover:text-black font-medium transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-sans text-lg mb-4 font-bold" style={{ color: '#000000' }}>Contact</h4>
            <address className="text-black/80 not-italic">
              <p className="font-semibold">Stylish Entertainment</p>
              <p>88 Weymouth Road</p>
              <p>Frome, Somerset</p>
              <p>BA11 1HJ</p>
            </address>
            <p className="text-black/80 mt-2">
              <Link href="/contact-us/" className="hover:text-black font-medium transition-colors">
                Get in touch →
              </Link>
            </p>
            
            {/* Social Media Icons */}
            <div className="mt-6">
              <h4 className="font-sans text-lg mb-4 font-bold" style={{ color: '#000000' }}>Follow Us</h4>
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-[#000000] hover:text-[#000000] transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
                      aria-label={`Visit our ${social.name} page`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-black/20 mt-6 pt-6 text-center text-black/70">
          <p className="mb-2">&copy; {new Date().getFullYear()} Stylish Entertainment. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/privacy-policy/" className="hover:text-black font-medium underline transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions/" className="hover:text-black font-medium underline transition-colors">
              Terms and Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
