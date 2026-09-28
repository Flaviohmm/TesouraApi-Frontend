export function Metric({ label, value, note }: {
    label: string;
    value: string;
    note: string
}) {
    return (
        <article className="metric">
            <p>{label}</p>
            <h2 className="font-sans font-medium">{value}</h2>
            <small>{note}</small>
        </article>
    );
}
