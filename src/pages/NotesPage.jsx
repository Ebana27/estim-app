import FeatureListPage from "./FeatureListPage";

const Page = () => (
  <FeatureListPage
    title="Notes"
    subtitle="Vos notes"
    endpoint="/notes"
    emptyLabel="Aucune note"
  />
);

export default Page;