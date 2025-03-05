"use client"
import { useEffect, useState } from "react";
import store from '../lib/store'
import { useSelector } from "react-redux";


export default function Home() {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js')
  }, [])


  return (
    <>
    </>
  );
}


export function Notification() {
  const [notify, setNotify] = useState({
    success: 0,
    message: ''
  });
  const [show, setShow] = useState(false);
  store.subscribe(() => {
    let state = store.getState();
    setNotify(state.notify)
  })

  useEffect(() => {
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 5000)
  }, [notify])

  return (<>
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