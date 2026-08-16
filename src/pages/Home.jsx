import React from 'react';
import Hero from '@/components/Hero';
import ManifestoMarquee from '@/components/sections/ManifestoMarquee';
import OwnershipProof from '@/components/sections/OwnershipProof';
import FeaturesBento from '@/components/sections/FeaturesBento';
import TechStackMarquee from '@/components/sections/TechStackMarquee';
import JoinCTA from '@/components/sections/JoinCTA';

export default function Home() {
  return (
    <div id="page-home">
      <Hero />
      <ManifestoMarquee />
      <OwnershipProof />
      <FeaturesBento />
      <TechStackMarquee />
      <JoinCTA />
    </div>
  );
}
