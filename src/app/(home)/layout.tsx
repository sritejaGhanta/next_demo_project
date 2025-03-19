"use client"
import { useEffect } from "react";
import "../../../public/css/simple-datatables.css"
import "../../../public/css/styles.css"
import Link from "next/link";
import { Clear, GetKey } from "../../utils/general/localstorage";
import { usePathname, useRouter } from "next/navigation";
import { ENV } from "../../envirolment/envirolment";

export default function RootLayout({
  children,
  prop = {}
}: Readonly<{
  children: React.ReactNode;
  prop: any
}>) {
  const route = useRouter()
  const logOut = () => {
    Clear();
    route.push("/auth/login")
  }

  if (!GetKey(ENV.TOKEN_KEY)) {
      alert(GetKey(ENV.TOKEN_KEY))
    // logOut();
  }

  const pathname = usePathname()
  const ckPath: any = (path: string) => (pathname === path) ? 'active' : '';

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js')
    import('../../../public/js/font-awesome');
    import('../../../public/js/scripts');
  }, []);


  return (<>
    <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
      <Link className={"navbar-brand ps-3 " + ckPath('/dashbord')} href="/dashbord" >Start Bootstrap</Link>
      <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" ><i className="fas fa-bars"></i></button>
      <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
        <div className="input-group">
          <input className="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" />
          <button className="btn btn-primary" id="btnNavbarSearch" type="button"><i className="fas fa-search"></i></button>
        </div>
      </form>
      <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
        <li className="nav-item dropdown">
          <Link className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="fas fa-user fa-fw"></i></Link>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
            <li><Link className={"dropdown-item " + ckPath('/profile')} href="/profile">Profile</Link></li>
            <li><Link className="dropdown-item" href="user/change-password">Change Password</Link></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" onClick={logOut}>Logout</a></li>
          </ul>
        </li>
      </ul>
    </nav>
    <div id="layoutSidenav">
      <div id="layoutSidenav_nav">
        <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
          <div className="sb-sidenav-menu">
            <div className="nav">
              <div className="sb-sidenav-menu-heading">Core</div>
              <Link className={"nav-link " + ckPath('/dashbord')} href="/dashbord">
                <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                Dashboard
              </Link>
              <div className="sb-sidenav-menu-heading">Interface</div>
              <Link className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseLayouts" aria-expanded="false" aria-controls="collapseLayouts">
                <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                Layouts
                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
              </Link>
              <div className="collapse" id="collapseLayouts" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                <nav className="sb-sidenav-menu-nested nav">
                  <Link className="nav-link" href="layout-static.html">Static Navigation</Link>
                  <Link className="nav-link" href="layout-sidenav-light.html">Light Sidenav</Link>
                </nav>
              </div>
              <Link className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapsePages" aria-expanded="false" aria-controls="collapsePages">
                <div className="sb-nav-link-icon"><i className="fas fa-book-open"></i></div>
                Pages
                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
              </Link>
              <div className="collapse" id="collapsePages" aria-labelledby="headingTwo" data-bs-parent="#sidenavAccordion">
                <nav className="sb-sidenav-menu-nested nav accordion" id="sidenavAccordionPages">
                  <Link className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#pagesCollapseAuth" aria-expanded="false" aria-controls="pagesCollapseAuth">
                    Authentication
                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                  </Link>
                  <div className="collapse" id="pagesCollapseAuth" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordionPages">
                    <nav className="sb-sidenav-menu-nested nav">
                      <Link className="nav-link" href="login.html">Login</Link>
                      <Link className="nav-link" href="register.html">Register</Link>
                      <Link className="nav-link" href="password.html">Forgot Password</Link>
                    </nav>
                  </div>
                  <Link className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#pagesCollapseError" aria-expanded="false" aria-controls="pagesCollapseError">
                    Error
                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                  </Link>
                  <div className="collapse" id="pagesCollapseError" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordionPages">
                    <nav className="sb-sidenav-menu-nested nav">
                      <Link className="nav-link" href="401.html">401 Page</Link>
                      <Link className="nav-link" href="404.html">404 Page</Link>
                      <Link className="nav-link" href="500.html">500 Page</Link>
                    </nav>
                  </div>
                </nav>
              </div>
              <div className="sb-sidenav-menu-heading">Addons</div>
              <Link className="nav-link" href="charts.html">
                <div className="sb-nav-link-icon"><i className="fas fa-chart-area"></i></div>
                Charts
              </Link>
              <Link className="nav-link" href="tables.html">
                <div className="sb-nav-link-icon"><i className="fas fa-table"></i></div>
                Tables
              </Link>
            </div>
          </div>
          <div className="sb-sidenav-footer">
            <div className="small">Logged in as:</div>
            Start Bootstrap
          </div>
        </nav>
      </div>
      <div id="layoutSidenav_content">
        <div className="p-2">
          {children}

        </div>
        <footer className="py-4 bg-light mt-auto">
          <div className="container-fluid px-4">
            <div className="d-flex align-items-center justify-content-between small">
              <div className="text-muted">Copyright &copy; Your Website 2023</div>
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