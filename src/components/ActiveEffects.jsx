// ✅ Работает с готовыми данными
export default function ActiveEffects({
  teamDebuffs,
  activePhobias,
  activeStatuses,
  currentPlayerId,
}) {
  return (
    <Card>
      <CardContent>
        {/* Командные дебафы */}
        <TeamDebuffs debuffs={teamDebuffs} />

        {/* Фобии игроков */}
        <PhobiaEffects
          phobias={activePhobias}
          currentPlayerId={currentPlayerId}
        />

        {/* Активные статусы */}
        <ActiveStatuses statuses={activeStatuses} />
      </CardContent>
    </Card>
  );
}
