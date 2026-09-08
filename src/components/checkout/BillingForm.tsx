"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Check, ChevronDown } from "lucide-react";

type Address = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  addressLine1: string;
  addressLine2: string | null;
  postalCode: string;
  city: string;
  country: string;
  vatNumber: string | null;
  isDefault: boolean;
};

export function BillingForm() {
  const [saving, setSaving] = useState(false);
  const [savedAddressId, setSavedAddressId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressList, setShowAddressList] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressLine1: "",
    city: "",
    postalCode: "",
  });

  const inputClass =
    "w-full rounded-xl border border-pink-200 bg-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-zinc-400 hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200";

  // ✅ Style para forçar cor do texto PRETO em todos os inputs
  const inputStyle = {
    color: "#18181b !important",
    WebkitTextFillColor: "#18181b !important",
    caretColor: "#18181b !important",
    backgroundColor: "#ffffff !important",
  } as React.CSSProperties;

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch("/api/auth/me");
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.user) {
            setUserData({
              firstName: data.user.firstName || "",
              lastName: data.user.lastName || "",
              email: data.user.email || "",
              phone: data.user.phone || "",
              addressLine1: data.user.addresses?.[0]?.addressLine1 || "",
              city: data.user.addresses?.[0]?.city || "",
              postalCode: data.user.addresses?.[0]?.postalCode || "",
            });
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    }

    async function fetchAddresses() {
      try {
        const response = await fetch("/api/addresses");
        
        if (response.ok) {
          const data = await response.json();
          setAddresses(data);
          
          const defaultAddress = data.find((addr: Address) => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddress(defaultAddress);
            setSavedAddressId(defaultAddress.id);
            
            window.dispatchEvent(
              new CustomEvent("address-saved", { detail: defaultAddress })
            );
          }
        }
      } catch (error) {
        console.error("Erro ao buscar moradas:", error);
      } finally {
        setLoadingUser(false);
      }
    }

    fetchUserData();
    fetchAddresses();
  }, []);

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
    setSavedAddressId(address.id);
    setShowAddressList(false);
    
    window.dispatchEvent(
      new CustomEvent("address-saved", { detail: address })
    );
  };

  const handleSaveAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);

    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phone: formData.get("phone"),
      email: formData.get("email") || null,
      addressLine1: formData.get("addressLine1"),
      addressLine2: formData.get("addressLine2") || null,
      postalCode: formData.get("postalCode"),
      city: formData.get("city"),
      country: formData.get("country") || "Portugal",
      vatNumber: formData.get("vatNumber") || null,
    };

    try {
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao guardar morada");
      }

      const address = await response.json();
      setSavedAddressId(address.id);
      setSelectedAddress(address);
      setShowNewAddressForm(false);
      setAddresses((prev) => [...prev, address]);

      window.dispatchEvent(
        new CustomEvent("address-saved", { detail: address })
      );
    } catch (error) {
      alert("Erro ao guardar morada");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-[30px] border border-pink-100 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-6 sm:mb-8">
        <h2 className="font-display text-2xl sm:text-3xl text-zinc-900">
          Dados de Faturação
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-zinc-500">
          Seleciona uma morada guardada ou adiciona uma nova.
        </p>
      </div>

      {loadingUser ? (
        <div className="flex justify-center py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-pink-200 border-t-pink-500" />
        </div>
      ) : (
        <>
          {addresses.length > 0 && (
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowAddressList(!showAddressList)}
                className="flex w-full items-center justify-between rounded-xl border-2 border-zinc-200 bg-zinc-50 px-4 py-3 text-left transition-all hover:border-pink-300 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="shrink-0 text-pink-500" />
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      {selectedAddress
                        ? `${selectedAddress.firstName} ${selectedAddress.lastName}`
                        : "Selecionar morada"}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {selectedAddress
                        ? `${selectedAddress.addressLine1}, ${selectedAddress.postalCode} ${selectedAddress.city}`
                        : "Escolhe uma morada guardada"}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-zinc-400 transition-transform ${showAddressList ? "rotate-180" : ""}`}
                />
              </button>

              {showAddressList && (
                <div className="mt-2 space-y-2">
                  {addresses.map((address) => (
                    <button
                      key={address.id}
                      type="button"
                      onClick={() => handleSelectAddress(address)}
                      className={`
                        flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all cursor-pointer
                        ${selectedAddress?.id === address.id
                          ? "border-pink-500 bg-pink-50"
                          : "border-zinc-200 bg-white hover:border-pink-300"
                        }
                      `}
                    >
                      <div
                        className={`
                          flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2
                          ${selectedAddress?.id === address.id ? "border-pink-500" : "border-zinc-300"}
                        `}
                      >
                        {selectedAddress?.id === address.id && (
                          <div className="h-2.5 w-2.5 rounded-full bg-pink-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-zinc-900">
                          {address.firstName} {address.lastName}
                          {address.isDefault && (
                            <span className="ml-2 rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-semibold text-pink-600">
                              Padrão
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {address.addressLine1}, {address.postalCode} {address.city}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-pink-500 hover:text-pink-600 cursor-pointer"
              >
                <Plus size={16} />
                {showNewAddressForm ? "Cancelar nova morada" : "Adicionar nova morada"}
              </button>
            </div>
          )}

          {(addresses.length === 0 || showNewAddressForm) && (
            <form onSubmit={handleSaveAddress} className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Primeiro Nome
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="João"
                  required
                  defaultValue={userData.firstName}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Último Nome
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Silva"
                  required
                  defaultValue={userData.lastName}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="email@exemplo.pt"
                  defaultValue={userData.email}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Telemóvel
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+351 912 345 678"
                  required
                  defaultValue={userData.phone}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Morada
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  placeholder="Rua Exemplo nº 10"
                  required
                  defaultValue={userData.addressLine1}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Código Postal
                </label>
                <input
                  type="text"
                  name="postalCode"
                  placeholder="2400-000"
                  required
                  defaultValue={userData.postalCode}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Cidade
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="Leiria"
                  required
                  defaultValue={userData.city}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  País
                </label>
                <select
                  name="country"
                  defaultValue="Portugal"
                  className={inputClass}
                  style={inputStyle}
                >
                  <option>Portugal</option>
                  <option>Espanha</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  NIF (Opcional)
                </label>
                <input
                  type="text"
                  name="vatNumber"
                  placeholder="123456789"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="
                    inline-flex h-11 px-6 text-sm font-semibold rounded-xl
                    items-center justify-center
                    bg-pink-500 text-white hover:bg-pink-600
                    transition-all disabled:opacity-50 cursor-pointer
                  "
                >
                  {saving ? "A guardar..." : "Guardar Morada"}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </section>
  );
}