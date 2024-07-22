import { Button } from 'react-bootstrap';
import { AccountDto } from '../api/account/dto';
import { useDeleteAccount } from '../api/account/use';
import '../App.css';

interface Param {
    accounts: AccountDto[];
};

export function AccountTable({ accounts }: Param) {
    const deleteAccount = useDeleteAccount();

    const handleDelete = async (account: AccountDto) => {
        await deleteAccount(account.id);
    }

    return (
        <table className='table table-bordered mx-2 my-2 w-75'>
            <thead>
                <tr>
                    <th className='bg-light'>Name</th>
                    <th className='bg-light'>Address</th>
                    <th className='bg-light'>Secret key path</th>
                    <th className='bg-light'>Password</th>
                    <th className='bg-light'></th>
                </tr>
            </thead>
            <tbody>
                {accounts.map((account) => (
                    <tr key={account.id}>
                        <td className='bg-light table-bold-column min-width-5'>{account.name}</td>
                        <td className='bg-light'>{account.address}</td>
                        <td className='bg-light'>{account.secretKeyPath}</td>
                        <td className='bg-light'>{account.password}</td>
                        <td className='bg-light'>
                            <Button
                                variant='outline-danger'
                                onClick={() => handleDelete(account)}
                            >
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
