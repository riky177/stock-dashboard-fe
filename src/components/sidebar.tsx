"use client";

import React, { ReactNode, useEffect } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { FiHome, FiTrendingUp, FiMenu } from "react-icons/fi";
import { IconType } from "react-icons";
import { useColorModeValue } from "./ui/color-mode";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

interface LinkItemProps {
  name: string;
  icon: IconType;
  url: string;
  private?: boolean;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Product", icon: FiHome, url: "/" },
  {
    name: "Staff",
    icon: FiTrendingUp,
    url: "/users",
    private: true,
  },
];

export default function Sidebar({ children }: { children: ReactNode }) {
  const isDesktop = useBreakpointValue({ base: false, md: true });

  const { open, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (isDesktop) {
      onOpen();
    } else {
      onClose();
    }
  }, [isDesktop, onOpen, onClose]);

  // Define keyframes for slide in animation
  const slideIn = keyframes`
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  `;

  const slideOut = keyframes`
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-100%);
    }
  `;

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      {/* Overlay for mobile */}
      {open && !isDesktop && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="blackAlpha.600"
          zIndex="overlay"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <Box
        position="fixed"
        left="0"
        top="0"
        h="100vh"
        w={{ base: "100vw", md: "240px" }}
        bg={useColorModeValue("white", "gray.900")}
        borderRight="1px"
        borderRightColor={useColorModeValue("gray.200", "gray.700")}
        transform={{
          base: open ? "translateX(0)" : "translateX(-100%)",
          md: "translateX(0)",
        }}
        transition={{ base: "transform 0.3s ease-in-out", md: "none" }}
        zIndex="modal"
        animation={{
          base: open ? `${slideIn} 0.3s ease-out` : `${slideOut} 0.3s ease-out`,
          md: "none",
        }}
        display={{ base: open ? "block" : "none", md: "block" }}
      >
        <SidebarContent onClose={onClose} />
      </Box>

      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box
        ml={{ base: 0, md: "240px" }}
        p="4"
        display={{ base: open ? "none" : "block", md: "block" }}
      >
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { data: session } = useSession();
  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <Box w="full" display="flex" flexDirection="column" h="100%" {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
          color={"blue.500"}
        >
          Inventory
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <Flex direction="column" gap={2}>
        {LinkItems.map((link) => {
          if (session?.user.role != "admin" && link.private) return null;
          return (
            <NavItem
              key={link.name}
              icon={link.icon}
              href={link.url}
              onClose={onClose}
            >
              {link.name}
            </NavItem>
          );
        })}
      </Flex>
      <Flex
        flex={1}
        justifyContent="flex-end"
        w="full"
        p={4}
        flexDir="column"
        align="center"
      >
        <Text
          textAlign="center"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {session?.user.email || ""}
        </Text>
        <Button
          colorPalette="red"
          size="sm"
          onClick={handleLogout}
          width="full"
          mt={2}
        >
          Logout
        </Button>
      </Flex>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactNode;
  href: string;
  onClose: () => void;
}
const NavItem = ({ icon, children, href, onClose, ...rest }: NavItemProps) => {
  return (
    <Box
      textDecoration={"none"}
      _focus={{ boxShadow: "none" }}
      onClick={onClose}
    >
      <Link href={href} passHref>
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: "blue.500",
            color: "white",
          }}
          {...rest}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: "white",
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Link>
    </Box>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: "240px" }}
      px={{ base: 4, md: 24 }}
      height={14}
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        size="xs"
      >
        <FiMenu size={12} />
      </IconButton>
    </Flex>
  );
};
