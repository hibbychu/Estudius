export async function logFlowDelay() {
  try {
    await fetch("/api/session/flow-delay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timestamp: new Date().toISOString() }),
    });
  } catch (err) {
    console.error("Flow delay logging failed:", err);
  }
}
