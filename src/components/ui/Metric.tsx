export function Metric({ label, value, note }: {
    label: string;
    value: string;
    note: string;
}) {
    return (
        <article className="metric">
            <div className="metric-tag">
                <i className="metric-dot" />
                <span className="mono">{label}</span>
            </div>
            <div className="data metric-value">{value}</div>
            <div className="metric-note">{note}</div>
        </article>
    );
}
