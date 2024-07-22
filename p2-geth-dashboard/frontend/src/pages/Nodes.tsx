import { useGetNodes } from '../api/node/use';
import { NodeTable } from '../components/NodeTable';

export function Nodes() {
    const { data } = useGetNodes();

    if (!data) {
        return null;
    }

    return <NodeTable nodes={data} />;
}
