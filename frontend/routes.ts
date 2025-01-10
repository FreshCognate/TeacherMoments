import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  index("./modules/dashboard/routes/homeRoute.tsx"),
  route("login", "./modules/authentication/routes/loginRoute.tsx"),
  ...prefix("scenarios", [
    index("./modules/scenarios/routes/scenariosRoute.tsx"),
    layout("./modules/scenarios/routes/scenarioEditorLayout.tsx", [
      route(":id/create", "./modules/scenarios/routes/createScenarioRoute.tsx", { id: "create" }),
      route(":id/build", "./modules/scenarios/routes/createScenarioRoute.tsx"),
      route(":id/share", "./modules/scenarios/routes/shareScenarioRoute.tsx"),
      route(":id/results", "./modules/scenarios/routes/scenarioResultsRoute.tsx"),
      route(":id/settings", "./modules/scenarios/routes/scenarioSettingsRoute.tsx"),
    ])
  ]),
] satisfies RouteConfig;