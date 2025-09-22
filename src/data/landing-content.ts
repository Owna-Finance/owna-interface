import { 
  Search, 
  CreditCard, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  ArrowRightLeft, 
  Building2, 
  Eye, 
  Shield,
  FileCheck,
  ShieldCheck,
  Umbrella 
} from 'lucide-react'
import { LandingPageContent } from '@/types/landing-page'

export const landingPageContent: LandingPageContent = {
  hero: {
    title: "Bringing Real Estate Yields On-Chain, Unlocking Global Access to Property Cashflows.",
    subtitle: "Tokenized RWA investments with short-term returns",
    description: "Access premium hotel property cashflows through blockchain tokenization. ",
    primaryCTA: {
      text: "Launch app",
      href: "/get-started",
      variant: "primary"
    },
    secondaryCTA: {
      text: "Learn About RWA",
      href: "/how-it-works", 
      variant: "outline"
    }
  },

  valueProposition: {
    title: "Traditional Real Estate, Reimagined",
    subtitle: "Break free from high barriers and illiquid investments",
    problemStatement: "Traditional real estate requires large capital commitments, long holding periods, and complex management. Most investors can't access premium hotel properties that generate consistent monthly cashflows.",
    solutionStatement: "OWNA tokenizes hotel real estate assets, allowing you to invest in fractions of premium properties. Earn monthly distributions from hotel operations without the complexity of direct ownership.",
    keyDifferentiator: "Short-term investment opportunities with monthly liquidity and returns from established hotel properties.",
    metrics: [
      {
        label: "Average Annual Return",
        value: "8-12%",
        description: "From monthly hotel revenue distributions"
      },
      {
        label: "Minimum Investment", 
        value: "$1,000",
        description: "Accessible entry point to premium real estate"
      },
      {
        label: "Holding Period",
        value: "6-18 months",
        description: "Flexible short-term investment horizon"
      }
    ]
  },

  process: {
    title: "How Hotel Tokenization Works",
    description: "Three simple steps to start earning from tokenized hotel real estate",
    steps: [
      {
        id: "browse",
        stepNumber: 1,
        title: "Browse Properties",
        description: "Explore tokenized hotel properties with detailed performance metrics, location data, and revenue projections.",
        icon: Search,
        duration: "2 minutes"
      },
      {
        id: "invest",
        stepNumber: 2,
        title: "Make Your Investment",
        description: "Purchase tokens representing ownership shares in hotel properties. Investments start from $1,000 with instant execution.",
        icon: CreditCard,
        duration: "5 minutes"
      },
      {
        id: "earn",
        stepNumber: 3,
        title: "Receive Monthly Returns",
        description: "Get automatic monthly distributions from hotel operations directly to your wallet. Track performance in real-time.",
        icon: TrendingUp,
        duration: "Ongoing"
      }
    ]
  },

  benefits: {
    title: "Why Choose Tokenized Hotel Real Estate",
    subtitle: "Combine the stability of real estate with the flexibility of modern investing",
    description: "Experience the benefits of hotel real estate investment without traditional barriers",
    features: [
      {
        id: "monthly-income",
        icon: Calendar,
        title: "Monthly Income Stream",
        description: "Receive consistent monthly distributions from hotel operations and bookings",
        metric: "8-12% APY",
        highlighted: true
      },
      {
        id: "low-minimum",
        icon: DollarSign,
        title: "Accessible Investment",
        description: "Start investing in premium hotel properties with just $1,000 minimum",
        metric: "$1,000 min"
      },
      {
        id: "liquidity",
        icon: ArrowRightLeft,
        title: "Token Liquidity",
        description: "Trade your property tokens anytime on secondary markets",
        metric: "24/7 trading"
      },
      {
        id: "diversification",
        icon: Building2,
        title: "Property Diversification",
        description: "Spread risk across multiple hotel properties and locations",
        metric: "50+ properties"
      },
      {
        id: "transparency",
        icon: Eye,
        title: "Complete Transparency",
        description: "Real-time performance tracking and detailed property analytics",
        metric: "Live data"
      },
      {
        id: "security",
        icon: Shield,
        title: "Blockchain Security", 
        description: "Immutable ownership records and smart contract automation",
        metric: "100% secure"
      }
    ]
  },

  socialProof: {
    title: "Trusted by Thousands of Investors",
    statistics: [
      {
        id: "total-value",
        value: "$50M+",
        label: "Total Property Value",
        description: "Across tokenized hotel assets"
      },
      {
        id: "active-investors",
        value: "2,500+",
        label: "Active Investors",
        description: "Growing community of RWA investors"
      },
      {
        id: "monthly-distributions",
        value: "$500K+",
        label: "Monthly Distributions",
        description: "Paid to investors last month"
      },
      {
        id: "average-return",
        value: "10.2%",
        label: "Average Annual Return",
        description: "Historical performance across all properties"
      }
    ],
    trustIndicators: [
      {
        id: "regulation",
        icon: FileCheck,
        title: "Regulatory Compliant",
        description: "Fully compliant with securities regulations and investor protection standards"
      },
      {
        id: "audit",
        icon: ShieldCheck,
        title: "Third-Party Audited",
        description: "Regular audits of smart contracts and financial operations by leading firms"
      },
      {
        id: "insurance",
        icon: Umbrella,
        title: "Property Insurance",
        description: "Comprehensive insurance coverage for all tokenized hotel properties"
      }
    ]
  },

  finalCTA: {
    title: "Start Earning from Hotel Real Estate Today",
    description: "Join thousands of investors already earning monthly returns from tokenized hotel properties. Get started in minutes with our simple onboarding process.",
    primaryCTA: {
      text: "Create Account & Invest",
      href: "/signup",
      variant: "primary"
    },
    secondaryCTA: {
      text: "Schedule a Consultation",
      href: "/consultation",
      variant: "outline"
    },
    urgency: {
      text: "Limited time: No platform fees for first 3 months",
      emphasized: true
    }
  }
}

export const videoConfiguration = {
  sources: [
    {
      src: "/Video/Background/owna-bg-mobile.mp4",
      media: "(max-width: 768px)",
      type: "video/mp4"
    },
    {
      src: "/Video/Background/owna-bg-tablet.mp4", 
      media: "(max-width: 1024px)",
      type: "video/mp4"
    },
    {
      src: "/Video/Background/owna-bg.mp4",
      type: "video/mp4"
    }
  ],
  poster: "/Images/video-poster.jpg",
  playbackSettings: {
    autoplay: true,
    muted: true,
    loop: true,
    playsInline: true,
    preload: "auto" as const
  },
  loadingStrategy: {
    lazy: false,
    intersectionThreshold: 0.1
  },
  qualityOptions: {
    mobile: "/Video/Background/owna-bg-mobile.mp4",
    tablet: "/Video/Background/owna-bg-tablet.mp4",
    desktop: "/Video/Background/owna-bg.mp4"
  }
}