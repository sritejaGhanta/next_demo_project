'use client'

import { CSSProperties, memo, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ENV } from "../envirolment/envirolment";
import { Axios } from "@utils/axios/service.ts";
import { ROUTE } from "../utils/axios/routes";
import { useDispatch } from "react-redux";
import { sSetUser } from "@lib/slice";
import { API_RESPONSE } from "@utils/general/interface";
import { Circles } from "react-loader-spinner";
import { signOut, useSession } from "next-auth/react";
import React from "react";
let checkIdenty = 0;

export const appLogOut = (session) => {
  localStorage.clear();
  Object.keys(session?.user || {}).length && signOut();
  window.location.href = "/auth/login";
};

export const AppInitializer = memo((prop) => {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  const { data: session, status, update } = useSession();
  const notAcceptPaths = ["/auth/login", "/auth/register", "/api/auth/signin"];
  const dispatch = useDispatch();
  let path = window.location.pathname;

  try {
    if (!localStorage.getItem(ENV.TOKEN_KEY) && session?.user?.access_token && status == "authenticated") {
      localStorage.setItem(process.env.TOKEN_KEY || "NEXT", session?.user?.access_token)
    }

    if (localStorage.getItem(ENV.TOKEN_KEY)) {
      if (checkIdenty == 0) {
        Axios.get(ROUTE.USER.INFO).then((res: API_RESPONSE) => {
          if (!res?.settings?.success) {
            throw "Session is ended.!";
          } else {
            dispatch(sSetUser(res?.data));
            if (res?.settings?.success && notAcceptPaths.includes(path) || path == "/") {
              // router.push("/dashbord");
              window.location.href = "/dashbord";
            }
          }
        })
        checkIdenty = 1
      }
    } else if (!notAcceptPaths.includes(path) || path == "/") {
      // window.location.href = "/dashbord";
      throw "sorry"
    }
  } catch (error) {
    alert(error)
    session?.user && update({ access_token: null })
    appLogOut(session);
  }

  return (
    <>
      {/* <Loder /> */}
    </>
  );
})

export const Loder = memo((prop: any) => {
  const loderRef = useRef(prop.ref?.current)
  const [loading, setLoader] = useState(false);
  const path = usePathname();

  // path change time loder is enable
  useEffect(() => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 500)
  }, [path]);

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
      {(loading) && <div className="loader">
        <Circles
          height="500"
          width="500"
          color="#4fa94d"
          ariaLabel="circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={loading}
        />
      </div>}
    </>
  );
})

export { SessionProvider } from "next-auth/react";
