"use client";
import {
  useGetContractsQuery,
  useCreateContractMutation,
} from "@/lib/features/apiSlice";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const { data: contracts, isLoading } = useGetContractsQuery();
  const [createContract] = useCreateContractMutation();

  const handleCreate = async () => {
    await createContract({
      title: "New React Contract",
      totalValue: 750,
      currency: "USD",
      status: "DRAFT",
      client: { id: 1 },
    });
    console.log(process.env.NEXT_PUBLIC_API_URL);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={() => {
            signOut();
            router.push("/");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Log Out
        </button>
      </div>

      <button
        onClick={handleCreate}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Add Contract
      </button>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {contracts?.map((c: any) => (
            <div
              key={c.id}
              className="p-4 bg-white rounded shadow text-black border"
            >
              <h2 className="font-bold">{c.title}</h2>
              <p>
                {c.totalValue} {c.currency}
              </p>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                {c.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
