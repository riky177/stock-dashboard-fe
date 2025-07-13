"use client";

import {
  Box,
  Button,
  Input,
  VStack,
  Dialog,
  Portal,
  CloseButton,
  Field,
} from "@chakra-ui/react";
import { CreateUserData } from "@/types/global";
import { ReactNode, useState, useEffect } from "react";
import { toaster } from "../ui/toaster";

interface UserFormProps {
  onSubmit: (data: CreateUserData) => Promise<void>;
  trigger?: ReactNode;
  onClose?: () => void;
}

const DefaultFormData = {
  email: "",
  password: "",
};

export default function UserForm({
  onSubmit,
  trigger,
  onClose,
}: UserFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(DefaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData(DefaultFormData);
    setErrors({});
  };

  useEffect(() => {
    resetForm();
    setErrors({});
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.trim() && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Only create new users, editing is disabled
      const createData: CreateUserData = {
        ...formData,
        role: "staff",
      };
      await onSubmit(createData);

      setIsOpen(false);
      setFormData({
        email: "",
        password: "",
      });
      setErrors({});
      onClose?.();
      toaster.success({ description: "Succes to create user." });
    } catch {
      toaster.error({
        description: "Failed to create user. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (details: { open: boolean }) => {
    setIsOpen(details.open);
    if (!details.open) {
      setFormData({
        email: "",
        password: "",
      });
      setErrors({});
      onClose?.();
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={handleOpenChange}
      onExitComplete={resetForm}
      onFocusOutside={resetForm}
      closeOnInteractOutside={false}
    >
      {trigger && (
        <Dialog.Trigger asChild onClick={() => setIsOpen(true)}>
          {trigger}
        </Dialog.Trigger>
      )}

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Add New User</Dialog.Title>
            </Dialog.Header>

            <Box p={4}>
              <form onSubmit={handleFormSubmit}>
                <VStack gap={4}>
                  <Field.Root required invalid={!!errors.email}>
                    <Field.Label>Email</Field.Label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {errors.email && (
                      <Field.ErrorText>{errors.email}</Field.ErrorText>
                    )}
                  </Field.Root>

                  <Field.Root required invalid={!!errors.password}>
                    <Field.Label>Password</Field.Label>
                    <Input
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    {errors.password && (
                      <Field.ErrorText>{errors.password}</Field.ErrorText>
                    )}
                  </Field.Root>
                </VStack>
              </form>
            </Box>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                onClick={handleFormSubmit}
                loading={isSubmitting}
                colorScheme="blue"
              >
                Create User
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
