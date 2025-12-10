import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { InsightsPage } from './pages/InsightsPage';
import { ArtistDetailPage } from './pages/ArtistDetailPage';
import { AlbumDetailPage } from './pages/AlbumDetailPage';
import { TrackDetailPage } from './pages/TrackDetailPage';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/artist/:id" element={<ArtistDetailPage />} />
          <Route path="/album/:id" element={<AlbumDetailPage />} />
          <Route path="/track/:id" element={<TrackDetailPage />} />
          
          
          {/* Catch all route */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Router>
  );
}

export default App;