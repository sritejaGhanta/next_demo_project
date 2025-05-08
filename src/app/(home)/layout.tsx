"use client";
import { useCallback, useEffect, useState } from "react";
import "../../../public/css/simple-datatables.css";
import "../../../public/css/styles.css";
import Link from "next/link";
import { Clear, GetKey } from "../../utils/general/localstorage";
import { usePathname, useRouter } from "next/navigation";
import { ENV } from "../../envirolment/envirolment";
import React from "react";
import store from "../../lib/store";
import { signOut, useSession } from "next-auth/react";

export default function RootLayout({
  children,
  prop = {},
}: Readonly<{
  children: React.ReactNode;
  prop: any;
}>) {
  const route = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();
  const ckPath: any = (path: string) => (pathname === path ? "active" : "");

  const [user, setUser] = useState(store.getState().user.payload || {})

  store.subscribe(() => {
    setUser(store.getState().user.payload)
  })

  const logOut = () => {
    Clear();
    if (Object.keys(session?.user || {}).length && status == "authenticated") {
      signOut({redirect: true, callbackUrl: "/auth/login"})
    }
    router.push("/auth/login");
  };

  const toggelBtn = useCallback(() => {
    document.body.classList.toggle("sb-sidenav-toggled");
    localStorage.setItem(
      "sb|sidebar-toggle",
      document.body.classList.contains("sb-sidenav-toggled") as any
    );
  }, []);
  1
  useEffect(() => {
    setTimeout(() => {
      import("../../../public/js/font-awesome");
    }, 100);
  }, []);

  if (!GetKey(ENV.TOKEN_KEY)) {
    logOut();
  }

  return (
    <>
      <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
        <Link
          className={"navbar-brand ps-3 " + ckPath("/dashbord")}
          href="/dashbord"
        >
          Teja Next Practice
        </Link>
        <button
          className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
          id="sidebarToggle"
          onClick={toggelBtn}
        >
          <i className="fas fa-bars"></i>
        </button>
        <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
          {/* <div className="input-group">
          <input className="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" />
          <button className="btn btn-primary" id="btnNavbarSearch" type="button"><i className="fas fa-search"></i></button>
        </div> */}
        </form>
        <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
          <li className="nav-item dropdown">
            <Link
              className="nav-link dropdown-toggle"
              id="navbarDropdown"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <b className="text-light me-1">
                {user.first_name} {user.last_name}
              </b>
              <i>
                <img
                  width={25}
                  height={25}
                  src={user.profile || "https://img.icons8.com/bubbles/150/000000/user.png"}
                  className="img-radius"
                  alt="User-Profile-Image"
                />
              </i>
            </Link>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="navbarDropdown"
            >
              <li>
                <Link
                  className={"dropdown-item " + ckPath("/profile")}
                  href="/profile"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  className={"dropdown-item " + ckPath("/change-password")}
                  href="change-password">
                  Change Password
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item" onClick={logOut}>
                  Logout
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <nav
            className="sb-sidenav accordion sb-sidenav-dark"
            id="sidenavAccordion"
          >
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">Core</div>
                <Link
                  className={"nav-link " + ckPath("/dashbord")}
                  href="/dashbord"
                >
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-tachometer-alt"></i>
                  </div>
                  Dashboard
                </Link>
                <div className="sb-sidenav-menu-heading">Persnol Info</div>
                <Link
                  className={"nav-link " + ckPath("/contacts")}
                  href="/contacts"
                >
                  <div className="sb-nav-link-icon">
                    <i className="fa-regular fa-circle-user"></i>
                  </div>
                  Contacts
                </Link>
                {/* <div
                  className="collapse"
                  id="collapseLayouts"
                  aria-labelledby="headingOne"
                  data-bs-parent="#sidenavAccordion"
                >
                  <nav className="sb-sidenav-menu-nested nav">
                    <Link className="nav-link" href="layout-static.html">
                      Static Navigation
                    </Link>
                    <Link className="nav-link" href="layout-sidenav-light.html">
                      Light Sidenav
                    </Link>
                  </nav>
                </div> */}
                {/* <Link
                  className="nav-link collapsed"
                  href="#"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapsePages"
                  aria-expanded="false"
                  aria-controls="collapsePages"
                >
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-book-open"></i>
                  </div>
                  Pages
                  <div className="sb-sidenav-collapse-arrow">
                    <i className="fas fa-angle-down"></i>
                  </div>
                </Link> */}
                {/* <div
                  className="collapse"
                  id="collapsePages"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#sidenavAccordion"
                >
                  <nav
                    className="sb-sidenav-menu-nested nav accordion"
                    id="sidenavAccordionPages"
                  >
                    <Link
                      className="nav-link collapsed"
                      href="#"
                      data-bs-toggle="collapse"
                      data-bs-target="#pagesCollapseAuth"
                      aria-expanded="false"
                      aria-controls="pagesCollapseAuth"
                    >
                      Authentication
                      <div className="sb-sidenav-collapse-arrow">
                        <i className="fas fa-angle-down"></i>
                      </div>
                    </Link>
                    <div
                      className="collapse"
                      id="pagesCollapseAuth"
                      aria-labelledby="headingOne"
                      data-bs-parent="#sidenavAccordionPages"
                    >
                      <nav className="sb-sidenav-menu-nested nav">
                        <Link className="nav-link" href="login.html">
                          Login
                        </Link>
                        <Link className="nav-link" href="register.html">
                          Register
                        </Link>
                        <Link className="nav-link" href="password.html">
                          Forgot Password
                        </Link>
                      </nav>
                    </div>
                    <Link
                      className="nav-link collapsed"
                      href="#"
                      data-bs-toggle="collapse"
                      data-bs-target="#pagesCollapseError"
                      aria-expanded="false"
                      aria-controls="pagesCollapseError"
                    >
                      Error
                      <div className="sb-sidenav-collapse-arrow">
                        <i className="fas fa-angle-down"></i>
                      </div>
                    </Link>
                    <div
                      className="collapse"
                      id="pagesCollapseError"
                      aria-labelledby="headingOne"
                      data-bs-parent="#sidenavAccordionPages"
                    >
                      <nav className="sb-sidenav-menu-nested nav">
                        <Link className="nav-link" href="401.html">
                          401 Page
                        </Link>
                        <Link className="nav-link" href="404.html">
                          404 Page
                        </Link>
                        <Link className="nav-link" href="500.html">
                          500 Page
                        </Link>
                      </nav>
                    </div>
                  </nav>
                </div> */}
                {/* <div className="sb-sidenav-menu-heading">Addons</div>
                <Link className="nav-link" href="charts.html">
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-chart-area"></i>
                  </div>
                  Charts
                </Link>
                <Link className="nav-link" href="tables.html">
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-table"></i>
                  </div>
                  Tables
                </Link> */}
              </div>
            </div>
            <div className="sb-sidenav-footer">
              <div className="small">Logged in as:</div>
              Start Bootstrap
            </div>
          </nav>
        </div>
        <div id="layoutSidenav_content">
          <div className="p-2">{children}</div>
          <footer className="py-4 bg-light mt-auto">
            <div className="container-fluid px-4">
              <div className="d-flex align-items-center justify-content-between small">
                <div className="text-muted">
                  Copyright &copy; Your Website 2023
                </div>
                <div>
                  <Link href="#">Privacy Policy</Link>
                  &middot;
                  <Link href="#">Terms &amp; Conditions</Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
