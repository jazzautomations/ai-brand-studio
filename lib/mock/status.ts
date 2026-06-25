import type { OrderStatus } from "@/lib/data/types";

/** Human-readable labels for every order status (PRD §6.3). */
export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "Pending payment",
  pending_call: "Awaiting brand call",
  call_in_progress: "Brand call in progress",
  call_completed: "Brief received — building",
  in_progress: "Pipeline running",
  qa_review: "Quality check",
  awaiting_client_review: "Directions ready",
  revision: "Revision in progress",
  final_compile: "Compiling deliverables",
  delivered: "Delivered",
};

export function statusLabel(s: OrderStatus): string {
  return STATUS_LABELS[s] || s;
}
