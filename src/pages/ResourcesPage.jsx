import FeatureListPage from "./FeatureListPage";
import { alertFunc } from "../js/utils/estimAlertFunc.js"


const Page = () => (
  alertFunc(),
  <FeatureListPage
    title="Ressources"
    subtitle="Cours et supports"
    endpoint="/ressources"
    emptyLabel="Aucune ressource"
  />
);

export default Page;

