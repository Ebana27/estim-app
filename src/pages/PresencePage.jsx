import FeatureListPage from "./FeatureListPage";
import { alertFunc } from "../js/utils/estimAlertFunc.js"

const Page = () => (
  alertFunc(),
  <FeatureListPage
    title="Presence"
    subtitle="Vos presences"
    endpoint="/presence"
    emptyLabel="Aucune presence"
  />
);

export default Page;

