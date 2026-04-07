import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ManageCardsPage from './pages/ManageCardsPage';
import ManageExpensesPage from './pages/ManageExpensesPage';
import ManagePaymentsPage from './pages/ManagePaymentsPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="cards" element={<ManageCardsPage />} />
          <Route path="expenses/monthly" element={<ManageExpensesPage mode="monthly" />} />
          <Route path="expenses/yearly" element={<ManageExpensesPage mode="yearly" />} />
          <Route path="payments" element={<ManagePaymentsPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
