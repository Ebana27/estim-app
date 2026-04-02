import FeatureListPage from "./FeatureListPage";
import { alertFunc } from "../utils/estimAlertFunc.js"
const Page = () => (
  alertFunc(),
  <FeatureListPage
    title="Bibliotheque"
    subtitle="Documents et references"
    endpoint="/bibliotheque"
    emptyLabel="Aucun document"
  />
);

export default Page;
