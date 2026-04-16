export default function Feedback({ loading, success, error }) {
  if (loading) return <p className="feedback loading">Carregando...</p>;
  if (error) return <p className="feedback error">{error}</p>;
  if (success) return <p className="feedback success">{success}</p>;
  return null;
}
