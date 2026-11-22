// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-card px-3 py-2 text-[12px] shadow-float">
      <p className="mb-1 font-semibold">{label ?? payload[0]?.payload?.range}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((p: any) => (
        <p key={p.dataKey} className="flex items-center gap-2 text-muted-foreground">
          <span className="size-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="capitalize">{p.dataKey}</span>
          <span className="tabular ml-auto font-semibold text-foreground">{p.value}</span>
        </p>
      ))}
    </div>
  );
}
