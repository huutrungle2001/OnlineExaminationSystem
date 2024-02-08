import React from "react";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import Layout from "../../components/Layout";

const Wrapper = styled("div")({
  width: "100%",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

const NavBarWrapper = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
});

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleNavigate = (path: any) => {
    navigate(path);
  };

  return (
    <Layout>
      <div
        style={{
          textAlign: "center",
          justifyContent: "center",
          marginTop: "50%",
        }}
      >
        Xin chào
      </div>
    </Layout>
  );
};

export default Dashboard;
