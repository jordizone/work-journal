import type { Route } from "./+types/home"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Work Journal" },
    { name: "description", content: "Welcome to React Router!" },
  ]
}

export default function Home() {
  return (
    <main className="m-auto mt-20 flex max-w-sm flex-col">
      <div className="w-full">
        <h1 className="text-3xl font-bold">Work Journal</h1>
        <p className="text-gray-500">Learning and doing. Updated weekly</p>
      </div>
      <div className="mt-10 w-full rounded-md border-2 border-dashed border-gray-200 p-2">
        <form action="">
          <p className="font-medium italic">Create an entry</p>
          {/* date */}
          <div className="mt-2 w-fit">
            <input className="rounded-md" type="date" name="date" id="date" />
          </div>
          {/* category */}
          <div className="mt-2 flex gap-3">
            <label
              className="flex items-center hover:cursor-pointer"
              htmlFor="work"
            >
              <input
                type="radio"
                className="mr-2"
                name="category"
                value="work"
                id="work"
              />
              Work
            </label>
            <label
              className="flex items-center hover:cursor-pointer"
              htmlFor="learning"
            >
              <input
                type="radio"
                className="mr-2"
                name="category"
                value="learning"
                id="learning"
              />
              Learning
            </label>
            <label
              className="flex items-center hover:cursor-pointer"
              htmlFor="interesting-thing"
            >
              <input
                type="radio"
                className="mr-2"
                name="category"
                value="interesting-thing"
                id="interesting-thing"
              />
              Interesting
            </label>
          </div>
          {/* content */}
          <div className="mt-2">
            <textarea
              className="w-full rounded-md border-gray-300"
              name="content"
              id="content"
              rows={4}
              placeholder="Write your journal entry here..."
            ></textarea>
          </div>
          {/* submit button */}
          <div className="mt-2 w-full text-right">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Add Entry
            </button>
          </div>
        </form>
      </div>
      <div className="mt-10">
        <p>No entries! Write your first journal entry.</p>
      </div>
    </main>
  )
}
