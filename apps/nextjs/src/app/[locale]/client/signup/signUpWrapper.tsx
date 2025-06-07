"use client";

import React from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SignUpForm from './form';

const SignUpWrapper: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === 'authenticated') {
      router.push('/account');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'authenticated') {
    return null;
  }

  return <SignUpForm />;
};

export default SignUpWrapper;