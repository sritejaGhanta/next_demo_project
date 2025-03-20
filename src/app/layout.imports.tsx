"use client";
import { useEffect, useState } from "react";
import store from "../lib/store";
import { useRouter } from "next/navigation";
import { Clear, GetKey } from "../utils/general/localstorage";
import { ENV } from "../envirolment/envirolment";
import Axios from "@utils/axios/service.ts";
import { ROUTE } from "./api/routes";
import { decodeJwt } from "jose";
import { useDispatch } from "react-redux";
import { APIRESPONSE } from "../utils/interfaces";
import { sSetUser } from "../lib/slice";

export { SessionProvider } from "next-auth/react";

export function AppInitializer() {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  const acceptPaths = ["/auth/login", "auth/register", "api/auth/signin"];
  const router = useRouter();
  const dispatch = useDispatch();
  const logOut = () => {
    Clear();
    router.push("/auth/login");
  };

  try {
    if (GetKey(ENV.TOKEN_KEY)) {
      let tokenData = decodeJwt(GetKey(ENV.TOKEN_KEY));
      console.log(tokenData);
      if (!tokenData.data || Date.now() / 1000 > tokenData.exp) {
        throw "Invalid token.";
      }

      let path = window.location.pathname;
      const notAllowPath = ["/auth/login", "/auth/register"];

      if (notAllowPath.includes(path) || path == "/") {
        router.push("/dashbord");
      }

      Axios.get(ROUTE.USER.INFO).then((res: APIRESPONSE) => {
        console.log(res);
        if (!res.settings.success) {
          throw "Api issue";
        }
        dispatch(sSetUser(res.data));
      });
    } else if (
      !GetKey(ENV.TOKEN_KEY) &&
      !acceptPaths.includes(window.location.pathname)
    ) {
      throw "Token not found.";
    }
  } catch (error) {
    console.log(error);
    logOut();
  }

  return (
    <>
      <Notification />
    </>
  );
}

export function Notification() {
  const [notify, setNotify] = useState({
    success: 0,
    message: "",
  });
  const [show, setShow] = useState(false);
  store.subscribe(() => {
    let state: any = store.getState();
    setNotify(state.notify);
  });

  useEffect(() => {
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 5000);
  }, [notify]);

  return (
    <>
      {show && notify.message && (
        <div className="d-flex justify-content-end position-absolute end-0 me-3 mt-3 ">
          {notify.success ? (
            <div className="alert alert-success alert-dismissible fade show">
              {notify.message}
            </div>
          ) : (
            <div className="alert alert-danger alert-dismissible fade show">
              {notify.message}
            </div>
          )}
        </div>
      )}
    </>
  );
}
