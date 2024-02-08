import React from "react";
import { styled } from "@mui/system";
import { useNavigate, Outlet } from "react-router-dom";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { logoutUser } from "../actions/authActions";

const Wrapper = styled("div")({
  width: "100%",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

const NavBarWrapper = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const Layout = ({ children }: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleNavigate = (path: any) => {
    navigate(path);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flex: 1 }}
            onClick={() => handleNavigate("/")}
          >
            Dashboard
          </Typography>
          <NavBarWrapper>
            <Button
              color="inherit"
              onClick={() => handleNavigate("/manage-users")}
            >
              Quản lý người dùng
            </Button>
            <Button
              color="inherit"
              onClick={() => handleNavigate("/manage-tests")}
            >
              Quản lý đề thi
            </Button>
            <Button
              color="inherit"
              onClick={() => handleNavigate("/take-exam")}
            >
              Làm đề thi
            </Button>
          </NavBarWrapper>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      {children}
    </>
  );
};

export default Layout;
