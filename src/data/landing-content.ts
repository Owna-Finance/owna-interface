import { Search, CreditCard, TrendingUp } from "lucide-react";
import { LandingPageContent } from "@/types/landing-page";

export const landingPageContent: LandingPageContent = {
  hero: {
    title:
      "Bringing Real Estate Yields On-Chain, Unlocking Global Access to Property Cashflows.",
    subtitle: "Tokenized RWA investments with short-term returns",
    description:
      "Access premium Real World Asset cashflows through blockchain tokenization, combining the stability of real estate with the efficiency and openness of DeFi.",
    primaryCTA: {
      text: "Launch app",
      href: "/get-started",
      variant: "primary",
    },
    secondaryCTA: {
      text: "Learn About RWA",
      href: "/how-it-works",
      variant: "outline",
    },
  },

  valueProposition: {
    title: "Traditional Real Estate, Reimagined",
    subtitle: "Break free from high barriers and illiquid investments",
    problemStatement:
      "Traditional real estate requires large capital commitments, long holding periods, and complex management. Most investors can't access premium hotel properties that generate consistent monthly cashflows.",
    solutionStatement:
      "OWNA tokenizes hotel real estate assets, allowing you to invest in fractions of premium properties. Earn monthly distributions from hotel operations without the complexity of direct ownership.",
    keyDifferentiator:
      "Short-term investment opportunities with monthly liquidity and returns from established hotel properties.",
    metrics: [
      {
        label: "Average Annual Return",
        value: "8-12%",
        description: "From monthly hotel revenue distributions",
      },
      {
        label: "Minimum Investment",
        value: "$1,000",
        description: "Accessible entry point to premium real estate",
      },
      {
        label: "Holding Period",
        value: "6-18 months",
        description: "Flexible short-term investment horizon",
      },
    ],
  },

  process: {
    title: "How Yield Property Tokenization Works",
    description:
      "Three simple steps to start earning from tokenized hotel real estate",
    steps: [
      {
        id: "browse",
        stepNumber: 1,
        title: "Browse Properties",
        description:
          "Explore tokenized hotel properties with detailed performance metrics, location data, and revenue projections.",
        icon: Search,
        duration: "2 minutes",
      },
      {
        id: "invest",
        stepNumber: 2,
        title: "Make Your Investment",
        description:
          "Purchase tokens representing ownership shares in hotel properties. Investments start from $1,000 with instant execution.",
        icon: CreditCard,
        duration: "5 minutes",
      },
      {
        id: "earn",
        stepNumber: 3,
        title: "Receive Monthly Returns",
        description:
          "Get automatic monthly distributions from hotel operations directly to your wallet. Track performance in real-time.",
        icon: TrendingUp,
        duration: "Ongoing",
      },
    ],
  },

  finalCTA: {
    title: "Tokenized yield properties, simplified.",
    description:
      "Join thousands of investors already earning monthly returns from tokenized hotel properties. Get started in minutes with our simple onboarding process.",
    primaryCTA: {
      text: "Launch App",
      href: "/signup",
      variant: "primary",
    },
  },
};

export const videoConfiguration = {
  sources: [
    {
      src: "/Video/Background/owna-bg.mp4",
      type: "video/mp4",
    },
  ],
  playbackSettings: {
    autoplay: true,
    muted: true,
    loop: true,
    playsInline: true,
    preload: "auto" as const,
  },
  loadingStrategy: {
    lazy: false,
    intersectionThreshold: 0.1,
  },
  qualityOptions: {
    mobile: "/Video/Background/owna-bg.mp4",
    tablet: "/Video/Background/owna-bg.mp4",
    desktop: "/Video/Background/owna-bg.mp4",
  },
};
