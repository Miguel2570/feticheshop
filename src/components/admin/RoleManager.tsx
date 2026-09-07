"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Shield, Star, Crown, User, CheckCircle2, Plus, X } from "lucide-react";

interface StaffMember {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: string;
  createdAt: Date;
}

interface RoleManagerProps {
  staffMembers: StaffMember[];
}

const roleOptions = [
  {
    value: "SUPER_ADMIN",
    label: "Super Admin",
    icon: Crown,
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    value: "ADMIN",
    label: "Admin",
    icon: Shield,
    color: "bg-pink-100 text-pink-700 border-pink-200",
  },
  {
    value: "MANAGER",
    label: "Manager",
    icon: Star,
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
];

export function RoleManager({ staffMembers }: RoleManagerProps) {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("ADMIN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleAddStaff() {
    if (!email.trim()) {
      setError("Insere um email");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/users/role-by-email`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role: selectedRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao adicionar");
      }

      setSuccess(`${data.user.email} adicionado como ${selectedRole === "SUPER_ADMIN" ? "Super Admin" : selectedRole === "ADMIN" ? "Admin" : "Manager"}`);
      setEmail("");
      setShowAddForm(false);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateRole(userId: string, newRole: string) {
    setUpdatingId(userId);
    setError("");

    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao atualizar cargo");
      }

      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Botão Adicionar */}
      {!showAddForm && (
        <button
          type="button"
          onClick={() => {
            setShowAddForm(true);
            setError("");
            setSuccess("");
          }}
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-pink-500
            px-6
            py-3
            text-sm
            font-semibold
            text-white
            transition-all
            cursor-pointer
            hover:bg-pink-600
          "
        >
          <Plus size={18} />
          Adicionar Pessoa
        </button>
      )}

      {/* Formulário Adicionar */}
      {showAddForm && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900">
              Adicionar Pessoa
            </h2>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            {/* Email */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.pt"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-zinc-200
                  bg-white
                  pl-11
                  pr-4
                  text-sm
                  text-zinc-900
                  outline-none
                  transition-all
                  placeholder:text-zinc-400
                  focus:border-pink-500
                  focus:ring-2
                  focus:ring-pink-200
                "
              />
            </div>

            {/* Cargo */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="
                h-12
                cursor-pointer
                rounded-xl
                border
                border-zinc-200
                bg-white
                px-4
                text-sm
                font-medium
                text-zinc-700
                outline-none
                focus:border-pink-500
                focus:ring-2
                focus:ring-pink-200
              "
            >
              {roleOptions.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>

            {/* Botão */}
            <button
              type="button"
              onClick={handleAddStaff}
              disabled={loading}
              className="
                inline-flex
                h-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-pink-500
                px-6
                text-sm
                font-semibold
                text-white
                transition-all
                cursor-pointer
                hover:bg-pink-600
                disabled:opacity-50
              "
            >
              {loading ? "A adicionar..." : "Adicionar"}
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
              <CheckCircle2 size={18} />
              {success}
            </div>
          )}
        </div>
      )}

      {/* Lista de staff */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr className="text-left">
                <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>
                  Membro
                </th>
                <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>
                  Email
                </th>
                <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>
                  Cargo
                </th>
                <th className="p-4 text-right text-sm font-semibold" style={{ color: "#52525b" }}>
                  Alterar Cargo
                </th>
              </tr>
            </thead>

            <tbody>
              {staffMembers.map((member) => {
                const currentRole = roleOptions.find((r) => r.value === member.role) || roleOptions[1];
                const Icon = currentRole.icon;

                return (
                  <tr key={member.id} className="border-b border-zinc-100 hover:bg-pink-50/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-100 text-xs font-bold text-pink-600">
                          {(member.firstName?.charAt(0) || member.email.charAt(0)).toUpperCase()}
                        </div>
                        <p className="font-medium text-zinc-900">
                          {member.firstName} {member.lastName}
                        </p>
                      </div>
                    </td>

                    <td className="p-4 text-sm text-zinc-600">
                      {member.email}
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${currentRole.color}`}>
                        <Icon size={14} />
                        {currentRole.label}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-end">
                        <select
                          value={member.role}
                          onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                          disabled={updatingId === member.id}
                          className="
                            h-10
                            cursor-pointer
                            rounded-xl
                            border
                            border-zinc-200
                            bg-white
                            px-3
                            pr-8
                            text-sm
                            font-medium
                            text-zinc-700
                            outline-none
                            transition-all
                            hover:border-pink-400
                            focus:border-pink-500
                            focus:ring-2
                            focus:ring-pink-200
                            disabled:opacity-50
                          "
                        >
                          {roleOptions.map((role) => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {staffMembers.length === 0 && (
          <div className="py-12 text-center text-zinc-500">
            Nenhum membro da equipa.
          </div>
        )}
      </div>
    </div>
  );
}