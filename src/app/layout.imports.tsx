"use client";
import { CSSProperties, useEffect, useState } from "react";
import store from "../lib/store";
import { usePathname, useRouter } from "next/navigation";
import { Clear, GetKey } from "../utils/general/localstorage";
import { ENV } from "../envirolment/envirolment";
import { Axios } from "@utils/axios/service.ts";
import { ROUTE } from "../utils/axios/routes";
import { decodeJwt } from "jose";
import { useDispatch } from "react-redux";
import { sSetUser } from "@lib/slice";
import { API_RESPONSE } from "@utils/general/interface";
import { ClockLoader } from "react-spinners";
import { SessionProvider } from "next-auth/react";

export function AppInitializer(prop) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  const acceptPaths = ["/auth/login", "/auth/register", "/api/auth/signin"];
  const router = useRouter();
  const dispatch = useDispatch();
  const logOut = () => {
    Clear();
    router.push("/auth/login");
  };

  try {
    if (GetKey(ENV.TOKEN_KEY)) {
      let tokenData = decodeJwt(GetKey(ENV.TOKEN_KEY));
      if (!tokenData.data || Date.now() / 1000 > tokenData.exp) {
        throw "Invalid token.";
      }

      let path = window.location.pathname;
      // const notAllowPath = ["/auth/login", "/auth/register"];

      if (acceptPaths.includes(path) || path == "/") {
        router.push("/dashbord");
      }

      Axios.get(ROUTE.USER.INFO).then((res: API_RESPONSE) => {
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
      <Loder />
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
        <div id="notification-pop-up" onClick={() => setShow(false)}>
          {notify.success ? (
            <div
              className="alert alert-success alert-dismissible fade show d-flex justify-content-between align-items-center p-2"
              dangerouslySetInnerHTML={{ __html: notify.message }}
            >
            </div>
          ) : (
            <div
              className="alert alert-danger alert-dismissible fade show d-flex justify-content-between align-items-center p-2"
              dangerouslySetInnerHTML={{ __html: notify.message }}
            >
            </div>
          )}
        </div>
      )}
    </>
  );
}

export function Loder() {
  const [loading, setLoader] = useState(false);
  const path = usePathname();
  useEffect(() => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 500)
  }, [path]);
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
    position: "fixed",
    top: "20%",
    left: "40%",
    zIndex: 1000,
  };

  Axios.ax.interceptors.response.use(
    (response) => {
      setLoader(false);
      return response as Response
    }
  )
  Axios.ax.interceptors.request.use((req) => {
    // this.addSpinner();
    try {
      setLoader(true);
      return req;

    } catch (error) {
      console.log(error)
    }
  })

  return (
    <>
      {loading && <div className="loader">
        <ClockLoader
          color="#077bf3"
          cssOverride={override}
          loading={loading}
          size={500}
          speedMultiplier={1}
        />
      </div>}
    </>
  );
}