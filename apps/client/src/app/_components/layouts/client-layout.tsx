import React from "react";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* You can add common layout elements here, like a header or sidebar */}
      <main>{children}</main>
      {/* You can also add a common footer here */}
    </div>
  );
};

export default ClientLayout;
