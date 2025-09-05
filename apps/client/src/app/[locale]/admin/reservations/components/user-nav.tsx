export const UserNav: React.FC<{ followers?: any[] }> = ({ followers }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold">Admin</span>
      <img
        src="/images/avatar-placeholder.png"
        alt="User Avatar"
        className="h-8 w-8 rounded-full border"
      />
    </div>
  );
};
