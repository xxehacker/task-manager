import { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { Navigate } from "react-router-dom";

function useUserAuth() {
  const { user, loading, setUser } = useContext(UserContext);
  // const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) return;

    if (!user) {
      <Navigate to={"/login"} />;
    }
  }, [user, loading, setUser]);
}

export default useUserAuth;
