import { format } from "date-fns"
import { useEffect, useRef } from "react"
import { useFetcher } from "react-router"

interface EntryFormProps {
  entry?: {
    date: string
    category: string
    content: string
  }
}

export function EntryForm({ entry }: EntryFormProps) {
  let fetcher = useFetcher()
  let textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (
      fetcher.data !== undefined &&
      fetcher.state !== "idle" &&
      textareaRef.current
    ) {
      textareaRef.current.value = ""
      textareaRef.current.focus()
    }
  }, [fetcher.state])

  return (
    <div className="mt-10 w-full rounded-md border-2 border-dashed border-gray-200 p-2">
      <fetcher.Form method="post">
        <p className="font-medium italic">Create an entry</p>
        <fieldset
          className="disabled:opacity-70"
          disabled={fetcher.state !== "idle"}
        >
          {/* date */}
          <div className="mt-2 w-fit">
            <input
              className="rounded-md border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
              type="date"
              name="date"
              id="date"
              defaultValue={entry?.date || format(new Date(), "yyyy-MM-dd")}
              required
            />
          </div>
          {/* category */}
          <div className="mt-2 flex gap-3">
            {[
              { label: "work", value: "work" },
              { label: "learning", value: "learning" },
              { label: "interesting", value: "interesting-thing" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center hover:cursor-pointer"
                htmlFor={option.value}
              >
                <input
                  type="radio"
                  className="mr-2 border-gray-300"
                  name="category"
                  id={option.value}
                  defaultChecked={option.value === (entry?.category ?? "work")}
                  required
                />
                {option.label}
              </label>
            ))}
          </div>
          {/* content */}
          <div className="mt-2">
            <textarea
              ref={textareaRef}
              className="w-full rounded-md border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
              name="content"
              id="content"
              rows={4}
              placeholder="Write your journal entry here..."
              defaultValue={entry?.content}
              required
            ></textarea>
          </div>
          {/* submit button */}
          <div className="mt-2 w-full text-right">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors focus-within:ring-2 focus-within:ring-blue-700 focus-within:ring-offset-2 focus-within:outline-none hover:cursor-pointer hover:bg-blue-400"
            >
              {fetcher.state !== "idle" ? "Saving..." : "Save"}
            </button>
          </div>
        </fieldset>
      </fetcher.Form>
    </div>
  )
}
