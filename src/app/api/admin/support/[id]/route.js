import { isValidObjectId } from "mongoose";
import { ok, fail, readJson, withAdmin } from "@/lib/api";
import { connectDB } from "@/lib/db";
import { cleanMultiline } from "@/lib/validators";
import SupportTicket, { TICKET_STATUSES } from "@/models/SupportTicket";

export const dynamic = "force-dynamic";

export const PATCH = withAdmin(async (request, { params }) => {
  const { id } = await params;
  const body = (await readJson(request)) || {};
  if (!isValidObjectId(id)) return fail("Report not found.", 404);
  if (!TICKET_STATUSES.includes(body.status)) return fail("Choose a valid status.", 422);
  await connectDB();
  await SupportTicket.findByIdAndUpdate(id, { status: body.status, adminNotes: cleanMultiline(body.adminNotes, 2000) });
  return ok();
});

/** Permanently deletes the record (used to honour a customer's request to erase their data). */
export const DELETE = withAdmin(async (_request, { params }) => {
  const { id } = await params;
  if (!isValidObjectId(id)) return fail("Record not found.", 404);
  await connectDB();
  await SupportTicket.findByIdAndDelete(id);
  return ok();
});
