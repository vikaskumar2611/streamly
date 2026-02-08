import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import RedirectIfAuthenticated from "./components/RedirectIfAuth";
import Watch from "./pages/core/Watch";
import ChannelProfile from "./pages/user/ChannelProfile";
import UploadVideo from "./pages/dashboard/UploadVideo";
import Settings from "./pages/user/Settings";
import ChangePassword from "./pages/user/ChangePassword";
import History from "./pages/user/History";
import Myplaylists from "./pages/playlist/Myplaylists";
import ViewPlaylist from "./pages/playlist/ViewPlaylist";
import Home from "./pages/core/Home";
import SearchResults from "./pages/core/SearchResults";
import Subscriptions from "./pages/core/Subscriptions";
import EditVideo from "./pages/dashboard/EditVideo";
import EditPost from "./pages/dashboard/EditPost";
import CreatePost from "./pages/user/CreatePost";
import AboutPage from "./pages/core/AboutPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<PersistLogin />}>
                {/* Public Routes */}
                <Route element={<Layout />}>
                    <Route path="about" element={<AboutPage />} />
                    <Route element={<RedirectIfAuthenticated />}>
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                    </Route>
                    {/* Protected Routes */}

                    <Route element={<RequireAuth />}>
                        <Route path="/" element={<Home />} />
                        <Route path="home" element={<Home />} />
                        <Route path="/watch/:videoId" element={<Watch />} />
                        <Route path="/results" element={<SearchResults />} />
                        {/* GET /videos/:id */}
                        {/* 2. User & Channel */}
                        <Route
                            path="/c/:username"
                            element={<ChannelProfile />}
                        />{" "}
                        {/* GET /users/c/:username */}
                        <Route path="/history" element={<History />} />{" "}
                        {/* GET /users/history */}
                        {/* 3. Playlists */}
                        <Route
                            path="/playlists"
                            element={<Myplaylists />}
                        />{" "}
                        {/* GET /playlists/user/:id */}
                        <Route
                            path="/playlists/:playlistId"
                            element={<ViewPlaylist />}
                        />
                        {/* 4. Dashboard & Studio (Creator Tools) */}
                        <Route path="/dashboard" element={<Dashboard />} />{" "}
                        {/* GET /users/dashboard */}
                        <Route path="/upload" element={<UploadVideo />} />{" "}
                        <Route path="/create/post" element={<CreatePost />} />
                        <Route
                            path="/subscriptions"
                            element={<Subscriptions />}
                        />
                        {/* POST /videos */}
                        {/* 5. Account Settings */}
                        <Route path="/settings" element={<Settings />} />{" "}
                        {/* PATCH /update-account, /avatar */}
                        <Route
                            path="/settings/password"
                            element={<ChangePassword />}
                        />
                    </Route>

                    <Route path="edit/video/:videoId" element={<EditVideo />} />
                    <Route path="edit/post/:postId" element={<EditPost />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;

//flow diagram
/*

Browser loads → <App>
 └─ <Routes>
      └─ "/" → <Layout>
           ├─ Navbar
           ├─ Conditional Search (user?)
           ├─ Nav Links
           └─ <Outlet>
                └─ <PersistLogin>
                     ├─ Check accessToken
                     ├─ Call refresh() if needed
                     └─ <Outlet>
                          └─ <RequireAuth>
                               ├─ If authorized → <Outlet>
                               └─ Else → <Navigate to="/login">
                                   
                          └─ Protected Page (Dashboard/Watch)
                               └─ AxiosPrivate API calls
                                    ├─ Request interceptor adds token
                                    └─ Response interceptor handles 401 → refresh → retry


*/
