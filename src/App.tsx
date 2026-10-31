/**
 * App.tsx — Root component with route definitions.
 * Uses React Router Outlet pattern via AppLayout.
 */

import { Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import HomePage from "@/pages/HomePage";
import SearchPage from "@/pages/SearchPage";
import ArtistPage from "@/pages/ArtistPage";
import AlbumPage from "@/pages/AlbumPage";
import GenrePage from "@/pages/GenrePage";
import PlaylistPage from "@/pages/PlaylistPage";
import LibraryPage from "@/pages/LibraryPage";
import LikedSongsPage from "@/pages/LikedSongsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/artist/:artistId" element={<ArtistPage />} />
        <Route path="/album/:albumId" element={<AlbumPage />} />
        <Route path="/genre/:genreName" element={<GenrePage />} />
        <Route path="/playlist/:playlistId" element={<PlaylistPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/liked" element={<LikedSongsPage />} />
      </Route>
    </Routes>
  );
}
