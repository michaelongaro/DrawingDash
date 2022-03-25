import AsideContent from "../components/layout/AsideContent";
import CardContainer from "../components/layout/CardContainer";
import FeaturedLikes from "../components/layout/FeaturedLikes";
import FocalSlidingDrawings from "../components/layout/FocalSlidingDrawings";

function HomePage() {
  return (
    <section>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "2em",
        }}
      >
        <div
          style={{
            opacity: "1",
            borderRadius: "5px",
            width: "10em",
            height: "5em",
          }}
        ></div>
        <FocalSlidingDrawings />
        <AsideContent />
      </div>
      <CardContainer />
      
      <FeaturedLikes />
    </section>
  );
}

export default HomePage;
