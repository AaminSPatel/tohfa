import { isValidObjectId } from "mongoose";
import { ok, fail, readJson, withAdmin } from "@/lib/api";
import { connectDB } from "@/lib/db";
import Inquiry, { INQUIRY_STATUSES } from "@/models/Inquiry";

export const dynamic = "force-dynamic";

export const PATCH = withAdmin(async (request, { params }) => {
  const { id } = await params;
  const { status } = (await readJson(request)) || {};
  if (!isValidObjectId(id)) return fail("Inquiry not found.", 404);
  if (!INQUIRY_STATUSES.includes(status)) return fail("Choose a valid status.", 422);
  await connectDB();
  await Inquiry.findByIdAndUpdate(id, { status });
  return ok({ status });
});

/** Permanently deletes the record (used to honour a customer's request to erase their data). */
export const DELETE = withAdmin(async (_request, { params }) => {
  const { id } = await params;
  if (!isValidObjectId(id)) return fail("Record not found.", 404);
  await connectDB();
  await Inquiry.findByIdAndDelete(id);
  return ok();
});
