import DemoPageComponent from "../../components/DemoPage";
import MobileWarning from "../../components/MobileWarning";

export default function DemoPage() {
    return (
        <div className="min-h-screen">
            {/* Show mobile warning on small screens */}
            <MobileWarning />

            {/* Show demo page only on md and above */}
            <div className="hidden md:block">
                <DemoPageComponent />
            </div>
        </div>
    );
}
