import { PrismaClient } from "generated/prisma/client"
import { Link, redirect, useLoaderData } from "react-router"
import { EntryForm } from "~/components/entry-form"
import type { Route } from "./+types/$id.edit"

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params

  if (typeof id !== "string") {
    throw new Error("Invalid entry ID")
  }

  let db = new PrismaClient()
  const entry = await db.entry.findUnique({
    where: { id: Number(id) },
  })

  console.log("Loaded entry:", entry)

  if (!entry) {
    throw new Response("Not Found", { status: 404 })
  }

  return {
    ...entry,
    date: entry.date.toISOString().substring(0, 10),
  }
}

export async function action({ request, params }: Route.ActionArgs) {
  let db = new PrismaClient()
  let formData = await request.formData()
  let data = Object.fromEntries(formData)
  console.log("Form data:", data)
  let { date, category, content } = data

  // Simulate a delay
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })

  if (
    typeof date !== "string" ||
    typeof category !== "string" ||
    typeof content !== "string"
  ) {
    throw new Error("Invalid form data")
  }

  // Here you would typically save the data to a database
  await db.entry.update({
    where: { id: Number(params.id) },
    data: {
      date: new Date(date),
      category,
      content,
    },
  })

  return redirect("/")
}

export default function EditEntry() {
  let entry = useLoaderData<typeof loader>()

  return (
    <div>
      <div className="mt-4">
        <Link to="/" className="text-blue-600">
          Back to Home
        </Link>
      </div>
      {/* Add your edit form here */}
      <div className="mt-4">
        {/* Form fields would go here */}
        <EntryForm entry={entry} />
      </div>
    </div>
  )
}
