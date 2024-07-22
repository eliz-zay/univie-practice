import { useGetGenesisJsonList } from '../api/genesis-json/use';
import { GenesisTable } from '../components/GenesisTable';

export function Genesis() {
    const { data } = useGetGenesisJsonList({ availableDirsOnly: false });

    if (!data) {
        return null;
    }

    return <GenesisTable genesisList={data} />;
}
