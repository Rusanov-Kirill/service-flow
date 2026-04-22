import { Suspense } from "react";

import Loader from "@/shared/ui/Loader";

const LazyRoute = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<Loader />}>{children}</Suspense>
);

export default LazyRoute;