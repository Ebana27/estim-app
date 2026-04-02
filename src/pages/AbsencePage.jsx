import FeatureListPage from "./FeatureListPage";

const Page = () => (
  <FeatureListPage
    title="Absences"
    subtitle="Vos absences et justifications"
    endpoint="/absences"
    emptyLabel="Aucune absence"
  />
);

export default Page;
