import { createRoute, type AnyRoute, type RouteComponent } from "@tanstack/react-router";

export function createAppChildRoute<TParentRoute extends AnyRoute, TPath extends string>(
  parentRoute: TParentRoute,
  path: TPath,
  component: RouteComponent,
) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path,
    component,
  });
}
