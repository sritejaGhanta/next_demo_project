"use client";
import { CSSProperties, useEffect, useState } from "react";
import store from "../lib/store";
import { usePathname, useRouter } from "next/navigation";
import { Clear, GetKey, SetKey } from "../utils/general/localstorage";
import { ENV } from "../envirolment/envirolment";
import { Axios } from "@utils/axios/service.ts";
import { ROUTE } from "../utils/axios/routes";
import { useDispatch } from "react-redux";
import { sSetUser } from "@lib/slice";
import { API_RESPONSE } from "@utils/general/interface";
import { ClockLoader } from "react-spinners";
import { signOut, useSession } from "next-auth/react";

export  const appLogOut = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  console.log(useSession())
  Clear();
  if (Object.keys(session?.user || {}).length && status == "authenticated") {
    signOut();
  }
  router.push("/auth/login");
};
export function AppInitializer(prop) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  const { data: session, status } = useSession();
  const acceptPaths = ["/auth/login", "/auth/register", "/api/auth/signin"];
  const router = useRouter();
  const dispatch = useDispatch();
  try {
    if (Object.keys(session?.user || {}).length && status == "authenticated") {
      if (!GetKey(ENV.TOKEN_KEY) && session.user.access_token) {
        SetKey(process.env.TOKEN_KEY, session.user.access_token)
      } else if(!GetKey(ENV.TOKEN_KEY) && !session.user.access_token){

      }
      dispatch(sSetUser(session.user))

      let path = window.location.pathname;

      if (acceptPaths.includes(path) || path == "/") {
        router.push("/dashbord");
      }

      const storeData: any = store.getState();

      if (!Object.keys(storeData?.user?.payload).length) {
        Axios.get(ROUTE.USER.INFO).then((res: API_RESPONSE) => {
          if (!res.settings.success) {
            throw "Api issue";
          }
          dispatch(sSetUser(res.data));
        });
      }

    } else if (
      !GetKey(ENV.TOKEN_KEY) &&
      !acceptPaths.includes(window.location.pathname)
    ) {
      throw "Token not found.";
    } else if(!(Object.keys(session?.user || {}).length && status == "authenticated") && GetKey(ENV.TOKEN_KEY)){
      throw "Session is ended.!";
    }
  } catch (error) {
    console.log(error);
    appLogOut();
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

export { SessionProvider } from "next-auth/react";
