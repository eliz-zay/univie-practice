import { useGetAccounts } from '../api/account/use';
import { AccountTable } from '../components/AccountTable';

export function Accounts() {
    const { data } = useGetAccounts();

    if (!data) {
        return null;
    }

    return <AccountTable accounts={data} />;
}
