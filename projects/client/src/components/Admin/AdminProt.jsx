import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import { login } from "./redux/userSlice";

const url = process.env.REACT_APP_API_BASE_URL;

export default function AdminProtection() {
  let location = useLocation();
  const [role, setRole] = useState(1);
  const dispatch = useDispatch()

  const token = localStorage.getItem("token");
  const keepLogin = async () => {
    try {
      const result = await axios.get(`${url}/user/keeplogin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(result.data);
      // setRole(result.data.role);
      console.log(result.data.role);

      dispatch(
        login({
          id: result.data.id,
          email: result.data.email,
          name: result.data.name,
        })
      );
    } catch (err) {
      console.log(err);
      console.log(err.response.data);
    }
  };

  return "test";
}
