"use client"
import { useEffect, useState } from "react";
import store from "../lib/store";
import { redirect } from "next/navigation";
import { Clear, GetKey } from "../utils/general/localstorage";
import { ENV } from "../envirolment/envirolment";
import Axios from "@utils/axios/service.ts"
import { ROUTE } from "./api/routes";
import { decodeJwt } from 'jose';

export { SessionProvider } from "next-auth/react"


export function AppInitializer() {
  const acceptPaths = ['/auth/login', 'auth/register', 'api/auth/signin']
  const logOut = () => {
    Clear();
    redirect('/auth/login');
  }

  useEffect(() => {
    if (GetKey(ENV.TOKEN_KEY)) {
      let tokenData = decodeJwt(GetKey(ENV.TOKEN_KEY))
      if (!tokenData.data || ((Date.now() / 1000) > tokenData.exp)) {
        logOut();
      }

      Axios.get(ROUTE.USER.INFO).then(e => {
        console.log(e)
      })

    } else if (!GetKey(ENV.TOKEN_KEY) && !acceptPaths.includes(window.location.pathname)) {
      logOut();
    }
  }, [])



  return <>
    <Notification />
  </>
}


export function Notification() {
  const [notify, setNotify] = useState({
    success: 0,
    message: ''
  });
  const [show, setShow] = useState(false);
  store.subscribe(() => {
    let state: any = store.getState();
    setNotify(state.notify)
  })

  useEffect(() => {
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 5000)
  }, [notify])

  return (
    <>
      {(show && notify.message) &&
        <div className="d-flex justify-content-end position-absolute end-0 me-3 mt-3 ">
          {(notify.success) ?
            <div className="alert alert-success alert-dismissible fade show">
              {notify.message}
            </div>
            :
            <div className="alert alert-danger alert-dismissible fade show">
              {notify.message}
            </div>
          }
        </div>
      }
    </>)
}