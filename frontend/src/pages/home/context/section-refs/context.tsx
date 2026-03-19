import { createContext } from 'react';
import type { HomePageSectionRefs } from './types';

export const HomePageSectionRefsContext = createContext<HomePageSectionRefs | null>(null);