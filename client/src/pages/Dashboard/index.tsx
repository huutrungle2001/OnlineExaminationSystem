import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { useAppSelector } from "../../store";

const Dashboard = () => {
  const navigate = useNavigate();

  const {
    auth: { userDetails },
  } = useAppSelector((state) => state);

  useEffect(() => {
    const isLoggedIn = userDetails?.token;

    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [userDetails, navigate]);

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
