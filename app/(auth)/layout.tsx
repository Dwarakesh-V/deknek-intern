import BottomText from './auth/components/BottomText';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full overflow-hidden">
      <div className="m-auto min-h-screen 2xl:container">
        <div className="relative flex min-h-screen w-full">
          <div className="m-auto w-full max-w-xl px-6 py-12 sm:p-20">
            {children}
            <BottomText />
          </div>
        </div>
      </div>
    </div>
  );
}
