import FeatureListPage from "./FeatureListPage";
import { alertFunc } from "../js/utils/estimAlertFunc.js"

const Page = () => (
  alertFunc(),
  <FeatureListPage
    title="Notes"
    subtitle="Vos notes"
    endpoint="/notes"
    emptyLabel="Aucune note"
  />
);

export default Page;

