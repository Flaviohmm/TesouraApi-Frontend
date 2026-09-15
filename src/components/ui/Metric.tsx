export function Metric({ label, value, note }: {
    label: string;
    value: string;
    note: string
}) {
    return (
        <article className="metric">
            <p>{label}</p>
            <h2>{value}</h2>
            <small>{note}</small>
        </article>
    );
}
