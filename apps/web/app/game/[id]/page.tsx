import GameComponent from "../../../components/GameComponent";

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <GameComponent id={id} />
    </div>
  );
}
