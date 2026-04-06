import type { RefObject } from "react";

export interface LandingPageSectionRefs {
    platformValuesRef: RefObject<HTMLDivElement> | null;
    targetAudienceRef: RefObject<HTMLDivElement> | null;
    specialistCapabilitiesRef: RefObject<HTMLDivElement> | null;
    pricingRef: RefObject<HTMLDivElement> | null;
}