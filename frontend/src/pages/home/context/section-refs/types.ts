import type { RefObject } from "react";

export interface HomePageSectionRefs {
    platformValuesRef: RefObject<HTMLDivElement> | null;
    targetAudienceRef: RefObject<HTMLDivElement> | null;
    specialistCapabilitiesRef: RefObject<HTMLDivElement> | null;
    pricingRef: RefObject<HTMLDivElement> | null;
}