import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageContainer from './components/layout/PageContainer';
import Card from './components/ui/Card';
import Button from './components/ui/Button';

// Placeholder Pages for now
const Dashboard = () => (
  <PageContainer title="Dashboard Overview">
    <Card>
      <h3>Welcome to Crypto Analytics</h3>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
        The layout and core UI components are now integrated.
      </p>
      <Button variant="primary">Get Started</Button>
    </Card>
  </PageContainer>
);

const Explore = () => <PageContainer title="Explore Market"><Card>Explore Content</Card></PageContainer>;
const Compare = () => <PageContainer title="Compare Coins"><Card>Compare Content</Card></PageContainer>;
const Analytics = () => <PageContainer title="Analytics"><Card>Analytics Content</Card></PageContainer>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
}

export default App;
