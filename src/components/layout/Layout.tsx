import { useEffect } from 'react';
import ScrollToTopButton from "../common/ScrollToTop";
import Footer from "./Footer";
import Header from "./Header";


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    useEffect(() => {
        document.documentElement.classList.add('dark');
        return () => {
            document.documentElement.classList.remove('dark');
        };
    }, []);
    

    return (
        <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-dark-3">
          <Header/>
          <main className="flex-1">
            {/* 좌측 광고 영역 */}
            <div className="fixed left-0 top-16 w-32 h-full bg-gray-50 hidden">
              <div className="p-4 text-center text-gray-400 text-sm">
                광고 영역
              </div>
            </div>
            
            {/* 메인 컨텐츠 */}
            <div className="xl:ml-32 xl:mr-32">
              {children}
            </div>
            
            {/* 우측 광고 영역 */}
            <div className="fixed right-0 top-16 w-32 h-full bg-gray-50 hidden">
              <div className="p-4 text-center text-gray-400 text-sm">
                광고 영역
              </div>
            </div>
          </main>
          <Footer />

          <ScrollToTopButton />
    </div>
  );
};

export default Layout