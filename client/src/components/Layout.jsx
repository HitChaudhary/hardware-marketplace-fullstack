import Announce from './Announce';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import Overlay from './Overlay';
import PageTransition from './PageTransition';
import { ScrollRestoration, ScrollToTopButton } from './ScrollToTop';

export default function Layout() {
  return (
    <>
      <ScrollRestoration />
      <Overlay />
      <Announce />

      <div className="main-wrapper">
        <Sidebar />

        <div className="main-content">
          <Navbar />
          <PageTransition />
          <Footer />
        </div>
      </div>

      <ScrollToTopButton />
    </>
  );
}
