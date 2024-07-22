import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NavigationBar } from './components/NavigationBar';
import { ToastContainer } from 'react-toastify';
import { NodeTab } from './components/NodeTab';
import { AccountTab } from './components/AccountTab';
import { Node } from './pages/Node';
import { GenesisTab } from './components/GenesisTab';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
        <ToastContainer toastStyle={{ borderRadius: 12 }} hideProgressBar />
        <Router>
            <NavigationBar />
            <Routes>
                <Route path='/' element={<Navigate to='/nodes' replace={true} />} />
                <Route path='/nodes' element={<NodeTab />} />
                <Route path='/accounts' element={<AccountTab />} />
                <Route path='/genesis' element={<GenesisTab />} />
                <Route path='/nodes/:id' element={<Node />} />
            </Routes>
        </Router>
    </QueryClientProvider>
  );
}

export default App;
