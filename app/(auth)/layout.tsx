const AuthLayout = ({ children }: { children: any }) => {
  return (
    <>
      <div className="h-screen w-full bg-gray-100 flex items-center justify-center">
        {children}
      </div>
    </>
  );
};

export default AuthLayout;
