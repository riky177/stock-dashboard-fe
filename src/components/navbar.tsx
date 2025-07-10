"use client";

import { Box, Button, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const { push } = useRouter();

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <Box
      bg={useColorModeValue("white", "gray.800")}
      borderBottomWidth="1px"
      boxShadow={useColorModeValue("sm", "dark-lg")}
      borderColor={useColorModeValue("gray.200", "gray.700")}
      px={4}
      py={3}
    >
      <Flex align="center">
        <Heading
          size="md"
          color="blue.500"
          cursor={"pointer"}
          onClick={() => push("/")}
        >
          Stock Dashboard
        </Heading>

        <Box ml={4}>
          <Link href="/product" passHref>
            Product
          </Link>
        </Box>

        {session?.user?.role === "admin" && (
          <Box ml={4}>
            <Link href="/users" passHref>
              Staff
            </Link>
          </Box>
        )}
        <Spacer />
        <Flex align="center" gap={4}>
          {session?.user?.email && (
            <Text fontSize="sm" color="gray.600">
              Welcome, {session.user.email}
            </Text>
          )}
          <Button
            colorScheme="red"
            variant="outline"
            size="sm"
            onClick={handleLogout}
            p={2}
          >
            Logout
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
