"use client";

export function SyncBackground() {
  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden" style={{ backgroundColor: "#fafafa" }}>
        {/* Glow rosa */}
        <div className="absolute left-[-250px] top-[-150px] h-[600px] w-[600px] rounded-full bg-pink-500/10 blur-[180px]" />

        {/* Glow fúcsia */}
        <div className="absolute bottom-[-250px] right-[-200px] h-[700px] w-[700px] rounded-full bg-fuchsia-500/10 blur-[180px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(#18181b20 1px, transparent 1px),
              linear-gradient(90deg,#18181b20 1px,transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Bolas animadas */}
        <div className="absolute left-1/4 top-32 h-4 w-4 animate-pulse rounded-full bg-pink-400" />
        <div className="absolute right-1/3 top-80 h-3 w-3 animate-ping rounded-full bg-fuchsia-400" />
        <div className="absolute bottom-40 left-1/2 h-5 w-5 animate-pulse rounded-full bg-pink-300" />
      </div>
    </>
  );
}