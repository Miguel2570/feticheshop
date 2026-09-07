import { prisma } from "@/lib/prisma";
import { RoleManager } from "@/components/admin/RoleManager";
import { Role } from "@prisma/client";

export default async function RolesPage() {
  const staffMembers = await prisma.user.findMany({
    where: {
      role: {
        in: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER],
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      role: "asc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "#18181b" }}>
          Gestão de Cargos
        </h1>
        <p style={{ color: "#71717a" }}>
          Adiciona e gere os membros da equipa
        </p>
      </div>

      <RoleManager staffMembers={staffMembers} />
    </div>
  );
}