'use client';

import { useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Button, Input, Card } from '@/components/ui';
import { useLogin } from '../hooks/useLogin';
import { isValidEmail } from '@/lib/utils/validators';

/**
 * Login form component
 */
export const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  const loginMutation = useLogin();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setServerError('');

    try {
      await loginMutation.mutateAsync({ email, password });
      router.push('/dashboard');
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <Card title="Login" sx={{ mt: 4 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {serverError && <Alert severity="error">{serverError}</Alert>}

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          errorMessage={errors.email}
          placeholder="Enter your email"
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password}
          errorMessage={errors.password}
          placeholder="Enter your password"
        />

        <Button type="submit" fullWidth isLoading={loginMutation.isPending}>
          Login
        </Button>

        <Typography variant="body2" align="center">
          Don't have an account?{' '}
          <a href="/register" style={{ color: '#1976d2', textDecoration: 'none' }}>
            Register here
          </a>
        </Typography>
      </Box>
    </Card>
  );
};