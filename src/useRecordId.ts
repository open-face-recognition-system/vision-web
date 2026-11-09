import { useParams } from 'react-router';

// null only on creation routes; a malformed id stays NaN so loading it fails instead of creating a record.
export default function useRecordId(): number | null {
  const { id } = useParams();
  return id === undefined ? null : Number(id);
}
