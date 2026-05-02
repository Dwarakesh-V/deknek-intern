import BottomText from './auth/components/BottomText';
import Logo from './auth/components/Logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full overflow-hidden">
      <div className="m-auto flex h-screen items-center justify-center 2xl:container">
        <div className="relative w-full max-w-md">
          <div className="m-auto rounded-lg border bg-white px-6 py-12 shadow-lg sm:p-20">
            <Logo />
            {children}
            <BottomText />
          </div>
        </div>
      </div>
    </div>
  );
}
