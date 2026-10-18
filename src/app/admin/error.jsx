"use client";
import Button from "@/components/ui/Button";

export default function AdminError({ error, reset }) {
  const dbIssue = /MONGODB|mongo|ECONN|ENOTFOUND|selection/i.test(error?.message || "");
  return (
    <div className="mx-auto max-w-lg px-6 py-20 text-center">
      <h1 className="text-display-md">{dbIssue ? "Can't reach the database" : "Something went wrong"}</h1>
      <p className="mt-3 text-ink-soft">{dbIssue ? "Check that MONGODB_URI is correct and that your IP is allowed in MongoDB Atlas (Network Access)." : "The admin panel hit an unexpected error. Try again."}</p>
      <Button onClick={reset} className="mt-6">Try again</Button>
    </div>
  );
}
