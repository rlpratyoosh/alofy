import CreateGameWindow from "../../../components/CreateGameWindow";
import MobileWarning from "../../../components/MobileWarning";

export default function CreateGamePage() {
    return (
        <>
            {/* Show mobile warning on small screens */}
            <MobileWarning />

            {/* Show create game window only on md and above */}
            <div className="hidden md:block">
                <CreateGameWindow />
            </div>
        </>
    );
}
