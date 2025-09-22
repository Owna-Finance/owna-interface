"use client";

import { SectionContainer } from '@/components/layout/section-container'
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect'
import Image from 'next/image'

export function BaseSection() {
  const words = [
    {
      text: "Build",
      className: "text-white",
    },
    {
      text: "on",
      className: "text-white",
    },
    {
      text: "Base.",
      className: "text-blue-500",
    },
  ]

  return (
    <SectionContainer background="dark" className="py-20 overflow-x-hidden">
      <div className="flex flex-col items-center justify-center max-w-5xl mx-auto text-center overflow-x-hidden">
        <div className="mb-8">
          <Image
            src="/Images/Logo/base-logo.png"
            alt="Base Logo"
            width={120}
            height={120}
            className="mx-auto"
          />
        </div>
        
        <TypewriterEffectSmooth 
          words={words} 
          className="justify-center"
          cursorClassName="bg-blue-500"
        />
        
        <div className="mt-8 space-y-4 max-w-4xl">
          <p className="text-2xl sm:text-3xl md:text-2xl lg:text-4xl font-medium text-white">
            We will make <span className="text-blue-500">Base</span> the center of the <span className="text-blue-500">onchain</span> economy with highly liquid, always-on, global capital markets.
          </p>
        </div>
        
        <p className="text-gray-300 text-lg mt-8 max-w-3xl leading-relaxed">
          The more assets and liquidity we bring to Base, the faster the entire financial world will come onchain.
        </p>
      </div>
    </SectionContainer>
  )
}