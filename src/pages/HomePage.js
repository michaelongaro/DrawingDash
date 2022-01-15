import AsideContent from "../components/layout/AsideContent";
import CardContainer from "../components/layout/CardContainer";
import FeaturedDrawings from "../components/layout/FeaturedDrawings";

function HomePage() {
  return (
    <section>
      <AsideContent />
      <CardContainer />
      <FeaturedDrawings />
    </section>
  );
}

export default HomePage;
