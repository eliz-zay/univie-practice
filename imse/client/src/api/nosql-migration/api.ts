
import api from '../../api';

export async function postMigration(): Promise<void> {
  await api.post('/migration');
}
