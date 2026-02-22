import GameComponent from "../../../components/GameComponent";
import MobileWarning from "../../../components/MobileWarning";

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <div>
            {/* Show mobile warning on small screens */}
            <MobileWarning />

            {/* Show game only on md and above */}
            <div className="hidden md:block">
                <GameComponent id={id} />
            </div>
        </div>
    );
}
