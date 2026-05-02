import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

import Loading from '@/components/ui/Loading';
import { useAuth } from '../hooks/useAuth';

const SocialLogin = () => {
  const { loadingGoogle, socialActions } = useAuth();

  return (
    <div className="mt-12 flex w-full justify-center">
      <button className="w-full max-w-md rounded-xl bg-blue-50 px-6 py-3 hover:bg-blue-100 focus:bg-blue-100 active:bg-blue-200">
        <div
          className="flex w-full items-center justify-center"
          onClick={() => socialActions('google')}
        >
          {loadingGoogle ? (
            <Loading className="mr-2" />
          ) : (
            <FcGoogle size={20} className="mr-2" />
          )}

          <span className="text-sm font-medium tracking-wide text-blue-700">
            Google
          </span>
        </div>
      </button>
    </div>
  );
};

export default SocialLogin;
