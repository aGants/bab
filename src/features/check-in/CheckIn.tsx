import { Link } from "react-router-dom";
import { Trans, useLingui } from "@lingui/react/macro";
import { ROUTES } from "@/routes/paths";
import { PageFrame } from "@/shared/layout";
import { Greeting, TabBar } from "@/shared/ui";
import decorativeShapes from "./assets/decorative-shapes.svg";
import './CheckIn.css';

export const CheckIn = () => {
  const { t } = useLingui();
  return (
    <PageFrame>
      <Greeting />
      <div className="check-in-banner">
        <span className="check-in-banner__icon">🌷</span>
        <div className="check-in-banner__text">
          <p className="check-in-banner__title"><Trans>New sticker unlocked!</Trans></p>
          <p className="check-in-banner__subtitle"><Trans>Claim your weekly reward</Trans></p>
        </div>
        <span className="check-in-banner__chevron">›</span>
      </div>
      <div className="check-in-wrapper">
        <div className="check-in-card">
          <img className="check-in-card__shapes" src={decorativeShapes} alt="" aria-hidden="true" />
          <div className="check-in-content">
            <h1><Trans>How is your body feeling today?</Trans></h1>
            <Link className="plus-button" to={ROUTES.words} aria-label={t`Start a check-in`}>+</Link>
          </div>
        </div>
      </div>
      <TabBar />
    </PageFrame>
  )
};
