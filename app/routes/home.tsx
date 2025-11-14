import { format, parseISO, startOfWeek } from "date-fns"
import { PrismaClient } from "generated/prisma/client"
import { Link, useLoaderData } from "react-router"
import { EntryForm } from "~/components/entry-form"
import type { Route } from "./+types/home"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Work Journal" },
    { name: "description", content: "Welcome to React Router!" },
  ]
}

export async function action({ request }: Route.ActionArgs) {
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
  return await db.entry.create({
    data: {
      date: new Date(date),
      category,
      content,
    },
  })
}

export async function loader({}: Route.LoaderArgs) {
  let db = new PrismaClient()
  let entries = await db.entry.findMany({
    orderBy: { date: "desc" },
  })
  return entries.map((entry) => ({
    ...entry,
    date: entry.date.toISOString().substring(0, 10),
  }))
}

export default function Home() {
  let entries = useLoaderData<typeof loader>()

  let entriesByWeek = entries.reduce<Record<string, typeof entries>>(
    (memo, entry) => {
      let sunday = startOfWeek(parseISO(entry.date))
      let sundayString = format(sunday, "yyyy-MM-dd")
      memo[sundayString] ||= []
      memo[sundayString].push(entry)
      return memo
    },
    {} as Record<string, typeof entries>
  )

  let weeks = Object.keys(entriesByWeek)
    .sort((a, b) => a.localeCompare(b))
    .map((dateString) => ({
      dateString,
      work: entriesByWeek[dateString].filter(
        (entry) => entry.category === "work"
      ),
      learning: entriesByWeek[dateString].filter(
        (entry) => entry.category === "learning"
      ),
      interesting: entriesByWeek[dateString].filter(
        (entry) => entry.category === "interesting-thing"
      ),
    }))

  return (
    <div>
      <EntryForm />

      {entries.length === 0 ? (
        <div className="mt-10">
          <p>No entries! Write your first journal entry.</p>
        </div>
      ) : (
        <div className="mt-10 w-full">
          <div className="mt-4 space-y-10">
            {weeks.map((week) => (
              <div key={week.dateString} className="bpt-4">
                <h3 className="text-xl font-semibold">
                  Week of {format(parseISO(week.dateString), "MMMM do")}
                </h3>
                {/* Work Entries */}
                {week.work.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-medium">👨‍💻 Work</h4>
                    <ul className="ml-4 list-inside list-disc">
                      {week.work.map((entry) => (
                        <EntryListItem key={entry.id} entry={entry} />
                      ))}
                    </ul>
                  </div>
                )}
                {/* Learning Entries */}
                {week.learning.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-medium">🧠 Learning</h4>
                    <ul className="ml-4 list-inside list-disc">
                      {week.learning.map((entry) => (
                        <EntryListItem key={entry.id} entry={entry} />
                      ))}
                    </ul>
                  </div>
                )}
                {/* Interesting Thing Entries */}
                {week.interesting.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-medium">✨ Interesting Things</h4>
                    <ul className="ml-4 list-inside list-disc">
                      {week.interesting.map((entry) => (
                        <EntryListItem key={entry.id} entry={entry} />
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function EntryListItem({
  entry,
}: {
  entry: Awaited<ReturnType<typeof loader>>[number]
}) {
  return (
    <li className="group mt-1">
      {entry.content}
      <Link
        to={`/entries/${entry.id}/edit`}
        className="ml-2 text-sm text-blue-600 underline opacity-0 transition-opacity group-hover:opacity-100 hover:cursor-pointer"
      >
        Edit
      </Link>
    </li>
  )
}
