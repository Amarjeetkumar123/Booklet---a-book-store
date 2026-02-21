import Footer from "./Footer";
import Header from "./Header";
import { Toaster } from "react-hot-toast";
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-primary-100">
      <Header />
      <main className="pt-16 min-h-screen">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#f97316",
              color: "#fff",
              borderRadius: "8px",
              padding: "16px",
              fontWeight: "500",
            },
            success: {
              iconTheme: {
                primary: "#fff",
                secondary: "#f97316",
              },
            },
          }}
        />
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
