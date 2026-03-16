import type { HTMLAttributes } from "react";

type LogoType = 'footer' | 'header';

export interface LogoProps extends HTMLAttributes<HTMLDivElement> {
    type: LogoType; 
}