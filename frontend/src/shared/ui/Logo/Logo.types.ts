import type { HTMLAttributes } from "react";

type LogoType = 'primary' | 'secondary';

export interface LogoProps extends HTMLAttributes<HTMLDivElement> {
    type: LogoType; 
}