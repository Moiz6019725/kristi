"use client";
import React from "react";
import { store } from "@/redux/store";
import { Provider } from "react-redux";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePathname } from "next/navigation";
import AnnouncementBar from "./AnnouncementBar";
import WhatsAppBTN from "./whatsapp-btn";

const Store = ({ children }) => {
  const pathname = usePathname();
  return (
    <Provider store={store}>
      {pathname === "/" && <AnnouncementBar />}
      {!pathname.startsWith("/admin") && <Navbar />}
      {children}
      {!pathname.startsWith("/admin") && <WhatsAppBTN />}
      {!pathname.startsWith("/admin") && <Footer />}
    </Provider>
  );
};

export default Store;
