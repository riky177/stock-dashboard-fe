"use client";

import React, { ReactNode } from "react";
import { useSession } from "next-auth/react";
// import Navbar from "./navbar";
import { Toaster } from "./ui/toaster";
import Sidebar from "./sidebar";

interface ContainerProps {
  children: ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <Toaster />
        <Sidebar>{children}</Sidebar>
      </>
    );
  }

  return children;
};

export default Container;
