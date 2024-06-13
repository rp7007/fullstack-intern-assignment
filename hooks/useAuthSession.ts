import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearAuth } from "@/redux/auth/auth.slice";
import { RootState } from "@/redux/store";
import axios from "axios";

const useAuthSession = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get('/api/auth/session', { headers: authHeader });
        const user = response.data.user
        if (user) {
          dispatch(setUser({ username: user.username }));
        } else {
          dispatch(clearAuth());
        }
      } catch (error) {
        dispatch(clearAuth());
      }
    };

    checkAuth();
  }, [token, dispatch]);

  return user;
};

export default useAuthSession;
