import { useParams } from 'react-router-dom';
import { useGetNode } from '../api/node/use';
import { NodeCard } from '../components/NodeCard';

export function Node() {
    const params = useParams();
    const { data } = useGetNode(params.id as string);

    if (!data) {
        return null;
    }

    return <NodeCard node={data} />;
}
