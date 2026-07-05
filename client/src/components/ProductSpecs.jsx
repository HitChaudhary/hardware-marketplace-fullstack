export default function ProductSpecs({ specs = {} }) {
  const entries = Object.entries(specs);
  if (entries.length === 0) return null;

  return (
    <table className="pspecs-table">
      <tbody>
        {entries.map(([key, value]) => (
          <tr key={key}>
            <th>{key}</th>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
