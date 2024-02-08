import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { autoLogin } from "./actions/authActions";
// import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AlertNotification from "./components/AlertNotification";
import { useAppSelector } from "./store";
import Loading from "./components/Loading";
import { NotFoundPage } from "./pages/NotFound";
import { UsersComponent } from "./pages/Users";
import { UserUpdateComponent } from "./pages/UserUpdate";
import Dashboard from "./pages/Dashboard";
import UserManager from "./pages/Dashboard/user/userManager";
import TestManager from "./pages/Dashboard/test/testManager";
import ContestDetails from "./pages/Dashboard/test/contestDetail";

function App() {
  const dispatch = useDispatch();
  const { loading, userDetails } = useAppSelector((state) => state.auth);

  // auto login
  useEffect(() => {
    dispatch(autoLogin());
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/manage-users" element={<UserManager />} />
          <Route path="/manage-tests" element={<TestManager />} />
          <Route path="/contest/:contestId" element = {<ContestDetails/>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
      <AlertNotification />
    </>
  );
}

export default App;
