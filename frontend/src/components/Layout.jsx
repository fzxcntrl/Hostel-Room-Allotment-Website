import Navbar from './Navbar';
import Footer from './Footer';

function Layout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="content-area">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
