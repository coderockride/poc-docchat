export default function SourceList({ sources }) {
  return (
    <div className="card">
      <h3>Sources</h3>

      {/* Empty state before any uploads or answers */}
      {sources.length === 0 ? (
        <p>No sources yet.</p>
      ) : (
        <ul className="source-list">
          {sources.map((source, index) => (
            <li key={`${source.name}-${index}`}>
              <strong>{source.name}</strong>

              {/* Show a short snippet preview when available */}
              {source.snippet ? <p>{source.snippet}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}