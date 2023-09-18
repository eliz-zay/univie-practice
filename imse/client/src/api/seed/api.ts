import api from '../../api';

export async function postSeed(): Promise<void> {
  await api.post('/seed');
}
