import { syncEmitter } from "@/lib/sync-emitter";

export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();

  let heartbeat: NodeJS.Timeout;

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: unknown) => {
        try {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify(data)}\n\n`
            )
          );
        } catch {
          // conexão fechada
        }
      };

      const listener = (data: unknown) => {
        send(data);
      };

      syncEmitter.on(
        "message",
        listener
      );

      heartbeat = setInterval(() => {
        try {
          controller.enqueue(
            encoder.encode(": heartbeat\n\n")
          );
        } catch {
          clearInterval(heartbeat);
        }
      }, 15000);

      send({
        type: "connected",
        message:
          "Ligação SSE estabelecida.",
      });

      const cleanup = () => {
        syncEmitter.off(
          "message",
          listener
        );

        clearInterval(heartbeat);
      };

      (
        controller as unknown as {
          _cleanup?: () => void;
        }
      )._cleanup = cleanup;
    },

    cancel() {
      clearInterval(heartbeat);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":
        "text/event-stream; charset=utf-8",
      "Cache-Control":
        "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}