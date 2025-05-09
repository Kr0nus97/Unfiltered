// src/app/account/page.tsx
export default function AccountPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-primary mb-6">Account Settings</h1>
      <div className="bg-card p-6 rounded-lg shadow-md border">
        <p className="text-muted-foreground">
          This is where your account settings and profile information will be displayed.
        </p>
        <p className="text-muted-foreground mt-4">
          Features like profile editing, notification preferences, and security settings will be available here in the future.
        </p>
      </div>
    </div>
  );
}
