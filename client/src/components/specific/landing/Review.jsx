import ReviewItem from "../../shared/ReviewItem";

const Review = () => {
  return (
    <section className="section review">
      <div className="review-container">
        <div className="review-content">
          <h2 className="review-title">Reviews</h2>
          <p className="review-desc">What our users say about us.</p>
        </div>
        <div className="review-cards-container">
          {[
            {
              img: "",
              name: "Muhammad Saif",
              review:
                "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio, expedita.",
            },
            {
              img: "",
              name: "Muhammad Sarim",
              review:
                "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio, expedita.",
            },
          ].map(({ img, name, review }, index) => (
            <ReviewItem key={index} img={img} name={name} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Review;
