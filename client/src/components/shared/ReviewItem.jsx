import profileImg from "../../../public/assets/images/profile.png";
import { Star } from "@mui/icons-material";

const ReviewItem = ({ img, name, review }) => {
  return (
    <div className="review-card">
      <img src={img ? img : profileImg} className="user-img" />
      <div className="card-content">
        <h4 className="card-title">{name}</h4>
        <p className="card-desc">{review}</p>
        <div className="rating-container">
          <Star />
          <Star />
          <Star />
          <Star />
          <Star />
        </div>
      </div>
    </div>
  );
};
export default ReviewItem;
