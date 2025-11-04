import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  index("./modules/dashboard/routes/homeRoute.tsx"),
  route("login", "./modules/authentication/routes/loginRoute.tsx"),
  ...prefix("scenarios", [
    index("./modules/scenarios/routes/scenariosRoute.tsx"),
    layout("./modules/scenarios/routes/scenarioEditorLayout.tsx", [
      route(":id/create", "./modules/scenarios/routes/createScenarioRoute.tsx"),
      route(":id/share", "./modules/scenarios/routes/shareScenarioRoute.tsx"),
      route(":id/results", "./modules/scenarios/routes/scenarioResultsRoute.tsx"),
      route(":id/settings", "./modules/scenarios/routes/scenarioSettingsRoute.tsx"),
    ])
  ]),
  ...prefix("cohorts", [
    index("./modules/cohorts/routes/cohortsRoute.tsx"),
    layout("./modules/cohorts/routes/cohortsEditorLayout.tsx", [
      route(":id/overview", "./modules/cohorts/routes/cohortOverviewRoute.tsx", { id: 'overview' }),
      route(":id/users", "./modules/cohorts/routes/cohortUsersRoute.tsx", { id: 'users' }),
      route(":id/scenarios", "./modules/cohorts/routes/cohortScenariosRoute.tsx", { id: 'scenarios' }),
      route(":id/settings", "./modules/cohorts/routes/cohortSettingsRoute.tsx", { id: 'settings' })
    ])
  ]),
  route("/play/:publishLink", "./modules/scenarios/routes/playScenarioRoute.tsx")
] satisfies RouteConfig;