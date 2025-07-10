"use client";

import React, { ReactNode } from "react";
import { useSession } from "next-auth/react";
import Navbar from "./navbar";

interface ContainerProps {
  children: ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <Navbar />
        {children}
      </>
    );
  }

  return children;
};

export default Container;
