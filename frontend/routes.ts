import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  index("./modules/dashboard/routes/home.tsx"),
  route("login", "./modules/authentication/routes/login.tsx"),
  ...prefix("scenarios", [
    index("./modules/scenarios/routes/scenarios.tsx"),
    layout("./modules/scenarios/routes/scenarioLayout.tsx", [
      route(":id/edit", "./modules/scenarios/routes/editScenario.tsx"),
      route(":id/create", "./modules/scenarios/routes/createScenario.tsx"),
      route(":id/preview", "./modules/scenarios/routes/previewScenario.tsx")
    ])
  ]),
] satisfies RouteConfig;