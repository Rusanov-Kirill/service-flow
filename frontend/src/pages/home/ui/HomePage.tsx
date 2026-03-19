import DualHero from "@/widgets/home/dual-hero";
import Footer from "@/widgets/home/footer";
import Header from "@/widgets/home/header";
import PlatformValues from "@/widgets/home/platform-values";
import PricingPlans from "@/widgets/home/pricing-plans";
import SpecialistCapabilities from "@/widgets/home/specialist-capabilities";
import TargetAudience from "@/widgets/home/target-audience";

const HomePage = () => {
    return (
        <>
            <Header />
            <DualHero />
            <PlatformValues />
            <TargetAudience />
            <SpecialistCapabilities />
            <PricingPlans />\
            <Footer />
        </>
    );
};

export default HomePage;