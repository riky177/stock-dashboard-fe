"use client";

import {
  Flex,
  Box,
  Input,
  Stack,
  Button,
  Heading,
  Field,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useColorModeValue } from "@/components/ui/color-mode";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred during login");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack mx={"auto"} maxW={"lg"} py={12} px={6} w={"full"}>
        <Stack align={"center"}>
          <Heading
            fontSize={"6xl"}
            textAlign={"center"}
            mb={8}
            color={"blue.500"}
          >
            Stock Dashboard
          </Heading>
          <Heading fontSize={"4xl"} textAlign={"center"} mb={2}>
            Login
          </Heading>
        </Stack>
        <form onSubmit={handleSubmit}>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack>
              {error && (
                <Box
                  bg="red.50"
                  border="1px"
                  borderColor="red.200"
                  borderRadius="md"
                  p={3}
                  mb={4}
                >
                  <Text color="red.600" fontSize="sm">
                    {error}
                  </Text>
                </Box>
              )}
              <Field.Root id="email" required>
                <Field.Label>Email address</Field.Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Field.Root>
              <Field.Root id="password" required>
                <Field.Label>Password</Field.Label>
                <Field.Root>
                  <InputGroup
                    endElement={
                      <Button
                        variant={"ghost"}
                        onClick={() =>
                          setShowPassword((showPassword) => !showPassword)
                        }
                      >
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    }
                  >
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Field.Root>
              </Field.Root>
              <Stack pt={2}>
                <Button
                  loading={isLoading}
                  loadingText="Signing in..."
                  size="lg"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  type="submit"
                  disabled={isLoading}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>
        </form>
      </Stack>
    </Flex>
  );
}
