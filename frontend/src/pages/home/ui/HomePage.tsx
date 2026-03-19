import { useRef } from 'react';

import DualHero from "@/widgets/home/dual-hero";
import Footer from "@/widgets/home/footer";
import Header from "@/widgets/home/header";
import PlatformValues from "@/widgets/home/platform-values";
import PricingPlans from "@/widgets/home/pricing-plans";
import SpecialistCapabilities from "@/widgets/home/specialist-capabilities";
import TargetAudience from "@/widgets/home/target-audience";

import { HomePageSectionRefsContext, type HomePageSectionRefs } from '../context';

const HomePage = () => {
    const platformValuesRef = useRef<HTMLDivElement>(null);
    const targetAudienceRef = useRef<HTMLDivElement>(null);
    const specialistCapabilitiesRef = useRef<HTMLDivElement>(null);
    const pricingRef = useRef<HTMLDivElement>(null);

    const sectionRefs = {
        platformValuesRef,
        targetAudienceRef,
        specialistCapabilitiesRef,
        pricingRef
    } as HomePageSectionRefs;

    return (
        <HomePageSectionRefsContext.Provider value={sectionRefs}>
            <Header />
            <DualHero />
            <PlatformValues ref={platformValuesRef} />
            <TargetAudience ref={targetAudienceRef} />
            <SpecialistCapabilities ref={specialistCapabilitiesRef} />
            <PricingPlans ref={pricingRef} />
            <Footer />
        </HomePageSectionRefsContext.Provider>
    );
};

export default HomePage;