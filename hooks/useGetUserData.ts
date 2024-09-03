import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
const useGetUserData = () => {
  const [userId, setUserId] = useState();

  useEffect(() => {
    const getUserId = async () => {
      const userId = await AsyncStorage.getItem("userId");
      setUserId(userId);
    };
    getUserId();
  }, []);
  return userId;
};

export default useGetUserData;
