import { createContext } from 'react';

import type { LandingPageSectionRefs } from './types';

export const LandingPageSectionRefsContext = createContext<LandingPageSectionRefs | null>(null);