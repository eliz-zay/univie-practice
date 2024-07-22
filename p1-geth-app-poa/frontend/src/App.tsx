import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Documents } from './pages/Documents';
import { NavigationBar } from './components/NavigationBar';
import { ToastContainer } from 'react-toastify';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer toastStyle={{ borderRadius: 12 }} hideProgressBar />
      <Router>
        <NavigationBar />
        <Routes>
          <Route path='/' element={<Documents />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
