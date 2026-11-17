export default function GuiaParticipantePage() {
  return (
    <div className="h-[calc(100vh-11rem)] w-full overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--surface-3)]">
      <iframe
        src="/guias/guia-participante.html"
        title="Guia do Participante"
        className="h-full w-full"
      />
    </div>
  );
}
