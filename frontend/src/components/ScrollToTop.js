import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  
  const { pathname } = useLocation();
  console.log(pathname)
  useEffect(() => {
    try {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    } catch (e) {
        console.log('error: ', e)
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

export default ScrollToTop;