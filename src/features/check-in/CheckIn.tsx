import { Link } from "react-router-dom";
import { ROUTES } from "@/routes/paths";
import { PageFrame } from "@/shared/layout";
import { Greeting, TabBar } from "@/shared/ui";
import decorativeShapes from "./assets/decorative-shapes.svg";
import './CheckIn.css';

export const CheckIn = () => {
  return (
    <PageFrame>
      <Greeting variant="home" />
      <div className="check-in-banner">
        <span className="check-in-banner__icon">🌷</span>
        <div className="check-in-banner__text">
          <p className="check-in-banner__title">New sticker unlocked!</p>
          <p className="check-in-banner__subtitle">Claim your weekly reward</p>
        </div>
        <span className="check-in-banner__chevron">›</span>
      </div>
      <div className="check-in-wrapper">
        <div className="check-in-card">
          <img className="check-in-card__shapes" src={decorativeShapes} alt="" aria-hidden="true" />
          <div className="check-in-content">
            <h1>How is your body feeling today?</h1>
            <Link className="plus-button" to={ROUTES.words} aria-label="Start a check-in">+</Link>
          </div>
        </div>
      </div>
      <TabBar />
    </PageFrame>
  )
};
