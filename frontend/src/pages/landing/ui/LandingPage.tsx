import { useRef } from 'react';

import DualHero from "@/widgets/home/dual-hero";
import Footer from "@/widgets/home/footer";
import Header from "@/widgets/home/header";
import PlatformValues from "@/widgets/home/platform-values";
import SpecialistCapabilities from "@/widgets/home/specialist-capabilities";
import TargetAudience from "@/widgets/home/target-audience";

import { LandingPageSectionRefsContext, type LandingPageSectionRefs } from '../context';

const LandingPage = () => {
    const platformValuesRef = useRef<HTMLDivElement>(null);
    const targetAudienceRef = useRef<HTMLDivElement>(null);
    const specialistCapabilitiesRef = useRef<HTMLDivElement>(null);

    const sectionRefs = {
        platformValuesRef,
        targetAudienceRef,
        specialistCapabilitiesRef,
    } as LandingPageSectionRefs;

    return (
        <LandingPageSectionRefsContext.Provider value={sectionRefs}>
            <Header />
            <DualHero />
            <PlatformValues ref={platformValuesRef} />
            <TargetAudience ref={targetAudienceRef} />
            <SpecialistCapabilities ref={specialistCapabilitiesRef} />
            <Footer />
        </LandingPageSectionRefsContext.Provider>
    );
};

export default LandingPage;