import { agentBackendUrl } from "@/lib/backend-url";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "请求体不是合法 JSON" }, { status: 400 });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);
  try {
    const upstream = await fetch(
      agentBackendUrl("/api/learning/next-step/evaluate"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
        signal: controller.signal,
      },
    );
    return new Response(await upstream.text(), {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("Content-Type") ||
          "application/json; charset=utf-8",
      },
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error && error.name === "AbortError"
            ? "学习资格评估超时"
            : "无法连接中央调度器的学习资格评估服务",
      },
      { status: 502 },
    );
  } finally {
    clearTimeout(timer);
  }
}
