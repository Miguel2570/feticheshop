import { DreamloveSyncPage } from "@/components/admin/sync/DreamloveSyncPage";

interface SyncPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SyncPage({
  params,
}: SyncPageProps) {
  const { id } = await params;

  return (
    <DreamloveSyncPage
      supplierId={id}
    />
  );
}