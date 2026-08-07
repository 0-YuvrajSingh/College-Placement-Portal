import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import CreateProfile from "./pages/CreateProfile"
import UpdateProfile from "./pages/UpdateProfile"
import ViewProfile from "./pages/ViewProfile"

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/profile/create"
          element={
            <ProtectedRoute>
              <CreateProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/update"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ViewProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <div className="container text-center mt-5">
              <h1 className="display-4">404</h1>
              <p className="lead text-muted">Page not found</p>
            </div>
          }
        />
      </Routes>
    </>
  )
}

export default App
