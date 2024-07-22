import { useGetDocuments } from '../api/document/use';
import { DocumentTable } from '../components/DocumentTable';

export function Documents() {
    const { data } = useGetDocuments();

    if (!data) {
        return null;
    }

    return <DocumentTable documents={data} />;
}
