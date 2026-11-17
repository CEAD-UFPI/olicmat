export default function GuiaCoordenadorPage() {
  return (
    <div className="h-[calc(100vh-11rem)] w-full overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--surface-3)]">
      <iframe
        src="/guias/guia-coordenador.html"
        title="Guia do Coordenador"
        className="h-full w-full"
      />
    </div>
  );
}
