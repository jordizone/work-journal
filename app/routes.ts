import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("entries/:id/edit", "routes/entries/$id.edit.tsx"),
] satisfies RouteConfig
