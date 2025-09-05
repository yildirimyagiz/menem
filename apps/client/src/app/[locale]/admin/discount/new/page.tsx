import { DiscountForm } from "../components/DiscountForm";

export default function NewDiscountPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Discount</h1>
        <p className="text-muted-foreground">
          Add a new discount code or promotion
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <DiscountForm isEditing={false} />
      </div>
    </div>
  );
}
