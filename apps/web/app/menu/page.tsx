import Menu from "../../components/Menu";
import TopBar from "../../components/TopBar";

export default function MenuPage() {
    return (
        <div className="flex flex-col min-h-screen font-mono">
            <TopBar />

            {/* Menu Component */}
            <div className="flex-1 flex items-center justify-center px-3 md:px-4 py-6 md:py-8">
                <Menu />
            </div>
        </div>
    );
}
