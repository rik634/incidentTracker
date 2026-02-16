import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IncidentList from './components/IncidentList';
import IncidentDetail from './components/IncidentDetail';
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b px-8 py-4 mb-8">
          <span className="font-bold text-xl tracking-tight">Zeotap Incident Manager</span>
        </nav>
        
        <main className="container mx-auto px-4">
          <Routes>
            <Route path="/" element={<IncidentList />} />
            <Route path="/incidents/:id" element={<IncidentDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;