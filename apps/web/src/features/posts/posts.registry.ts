import { JSX } from "react";
import {
  CleanArchitecturePost,
  ReactQueryPatternsPost,
  PremiumDocsUiPost,
  EfCorePostgresMigrationsPost,
} from "./posts.content";

export const postComponents: Record<string, () => Promise<JSX.Element>> = {
  "clean-architecture-dotnet-nextjs": CleanArchitecturePost,
  "react-query-patterns": ReactQueryPatternsPost,
  "premium-docs-ui-system": PremiumDocsUiPost,
  "efcore-postgres-migrations-playbook": EfCorePostgresMigrationsPost,
};
