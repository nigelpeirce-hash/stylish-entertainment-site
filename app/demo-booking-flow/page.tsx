"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  User, 
  Calendar, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Music,
  CreditCard,
  Clock
} from "lucide-react";

export default function DemoBookingFlowPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    document.title = "Booking Flow Demo | Stylish Entertainment";
  }, []);

  const steps = [
    {
      number: 1,
      title: "Initial Booking Form",
      description: "Complete the DJ booking confirmation form with your event details",
      url: "/dj-booking-confirmation",
      icon: FileText,
      details: [
        "Full names (happy couple for weddings)",
        "Home address",
        "Contact details",
        "Event date and type",
        "Chosen DJ selection",
        "Venue information",
        "Agreed fee",
        "Accept Terms & Conditions",
        "Option to create account"
      ]
    },
    {
      number: 2,
      title: "Account Creation (Optional)",
      description: "If you chose to create an account, you'll be redirected to login",
      url: "/login",
      icon: User,
      details: [
        "Automatic account creation if selected",
        "Login with email and password",
        "View your bookings dashboard",
        "Manage your profile"
      ]
    },
    {
      number: 3,
      title: "Client Dashboard",
      description: "View all your bookings and manage your account",
      url: "/client/dashboard",
      icon: Calendar,
      details: [
        "View all bookings",
        "Access DJ worksheet",
        "View profile",
        "Manage event details"
      ],
      requiresAuth: true
    },
    {
      number: 4,
      title: "Final DJ Worksheet",
      description: "Complete detailed final DJ information (sent 3 weeks before event)",
      url: "/dj-worksheet",
      icon: Music,
      details: [
        "Happy couple details",
        "Venue information (full address)",
        "DJ arrival, start & finish times",
        "Setup location and parking",
        "Payment details",
        "Music requests and first dance",
        "Special instructions"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Client Booking Flow Demo
          </h1>
          <p className="text-gray-400 text-center text-lg mb-8">
            Step-by-step guide to the booking process
          </p>
        </motion.div>

        {/* Status Card */}
        <Card className="bg-gray-800 border-champagne-gold/30 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-6 h-6 text-champagne-gold" />
              Authentication Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {status === "loading" ? (
              <p className="text-gray-400">Checking authentication...</p>
            ) : session ? (
              <div className="space-y-2">
                <p className="text-green-400 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Logged in as: <span className="font-semibold">{session.user?.email}</span>
                </p>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => router.push("/client/dashboard")}
                    className="bg-champagne-gold text-black hover:bg-gold-light"
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    onClick={() => router.push("/dj-booking-confirmation")}
                    variant="outline"
                    className="border-gray-700 text-white"
                  >
                    Start New Booking
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-yellow-400">Not logged in - viewing as guest</p>
                <p className="text-sm text-gray-400">
                  You can still complete bookings, but won't have access to the dashboard
                </p>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => router.push("/login")}
                    className="bg-champagne-gold text-black hover:bg-gold-light"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => router.push("/register")}
                    variant="outline"
                    className="border-gray-700 text-white"
                  >
                    Register
                  </Button>
                  <Button
                    onClick={() => router.push("/dj-booking-confirmation")}
                    variant="outline"
                    className="border-gray-700 text-white"
                  >
                    Book as Guest
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isDisabled = step.requiresAuth && !session;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`bg-gray-800 border-champagne-gold/30 ${isDisabled ? 'opacity-60' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-champagne-gold/20 border-2 border-champagne-gold">
                          <span className="text-2xl font-bold text-champagne-gold">{step.number}</span>
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <IconComponent className="w-6 h-6 text-champagne-gold" />
                            {step.title}
                          </CardTitle>
                          <p className="text-gray-400 mt-1">{step.description}</p>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <ArrowRight className="w-6 h-6 text-champagne-gold hidden md:block" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-champagne-gold mb-3">Details Collected:</h4>
                        <ul className="space-y-2">
                          {step.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                              <CheckCircle className="w-4 h-4 text-champagne-gold mt-0.5 flex-shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold text-champagne-gold mb-3">URL:</h4>
                          <code className="block p-3 bg-gray-900 rounded border border-gray-700 text-champagne-gold mb-4 break-all">
                            {step.url}
                          </code>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            asChild
                            className="bg-champagne-gold text-black hover:bg-gold-light flex-1"
                            disabled={isDisabled}
                          >
                            <Link href={step.url}>
                              {isDisabled ? "Login Required" : "Try This Step"}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Links */}
        <Card className="bg-gray-800 border-champagne-gold/30 mt-8">
          <CardHeader>
            <CardTitle>Quick Test Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                asChild
                variant="outline"
                className="border-gray-700 text-white"
              >
                <Link href="/dj-booking-confirmation">
                  Booking Form
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gray-700 text-white"
              >
                <Link href="/dj-worksheet">
                  DJ Worksheet
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gray-700 text-white"
              >
                <Link href="/login">
                  Login
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gray-700 text-white"
              >
                <Link href="/register">
                  Register
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Process Flow Diagram */}
        <Card className="bg-gray-800 border-champagne-gold/30 mt-8">
          <CardHeader>
            <CardTitle>Complete Booking Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-gray-900 rounded border border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-champagne-gold/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-champagne-gold" />
                  </div>
                  <div>
                    <p className="font-semibold">1. Receive Email</p>
                    <p className="text-sm text-gray-400">Client receives booking confirmation email</p>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-champagne-gold hidden md:block" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-champagne-gold/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-champagne-gold" />
                  </div>
                  <div>
                    <p className="font-semibold">2. Booking Form</p>
                    <p className="text-sm text-gray-400">Complete initial booking details</p>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-champagne-gold hidden md:block" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-champagne-gold/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-champagne-gold" />
                  </div>
                  <div>
                    <p className="font-semibold">3. T&Cs Accepted</p>
                    <p className="text-sm text-gray-400">Terms & Conditions accepted</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-gray-900 rounded border border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-champagne-gold/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-champagne-gold" />
                  </div>
                  <div>
                    <p className="font-semibold">4. Account (Optional)</p>
                    <p className="text-sm text-gray-400">Create account during booking</p>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-champagne-gold hidden md:block" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-champagne-gold/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-champagne-gold" />
                  </div>
                  <div>
                    <p className="font-semibold">5. Dashboard</p>
                    <p className="text-sm text-gray-400">View bookings in dashboard</p>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-champagne-gold hidden md:block" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-champagne-gold/20 flex items-center justify-center">
                    <Music className="w-5 h-5 text-champagne-gold" />
                  </div>
                  <div>
                    <p className="font-semibold">6. Final Worksheet</p>
                    <p className="text-sm text-gray-400">Complete detailed DJ worksheet</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
