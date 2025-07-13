"use client";

import React, { ReactNode } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Button,
} from "@chakra-ui/react";
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
    name: "Staff Management",
    icon: FiTrendingUp,
    url: "/users",
    private: true,
  },
];

export default function Sidebar({ children }: { children: ReactNode }) {
  const { open, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer.Root open={open} placement="start" size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer.Root>
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
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
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
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
            <NavItem key={link.name} icon={link.icon} href={link.url}>
              {link.name}
            </NavItem>
          );
        })}
      </Flex>
      <Box position="absolute" bottom={0} w="full" p={4}>
        <Text textAlign="center">{session?.user.email || ""}</Text>
        <Button
          colorPalette="red"
          size="sm"
          onClick={handleLogout}
          width="full"
          mt={2}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactNode;
  href: string;
}
const NavItem = ({ icon, children, href, ...rest }: NavItemProps) => {
  const {} = useSession();
  return (
    <Box textDecoration={"none"} _focus={{ boxShadow: "none" }}>
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
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton variant="outline" onClick={onOpen} aria-label="open menu">
        <FiMenu />
      </IconButton>
    </Flex>
  );
};
