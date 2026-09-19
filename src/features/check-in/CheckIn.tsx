import { Link } from "react-router-dom";
import { Trans, useLingui } from "@lingui/react/macro";
import { ROUTES } from "@/routes/paths";
import { PageFrame } from "@/shared/layout";
import { Greeting, TabBar } from "@/shared/ui";
import chevronRight from "./assets/chevron-right.svg";
import decorativeShapes from "./assets/decorative-shapes.svg";
import stickerTulip from "./assets/sticker-tulip.svg";
import './CheckIn.css';

const AddIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

export const CheckIn = () => {
  const { t } = useLingui();
  return (
    <PageFrame>
      <Greeting welcome />
      <Link className="check-in-banner" to={ROUTES.world}>
        <span className="check-in-banner__icon">
          <img src={stickerTulip} width={35.245} height={50.201} alt="" aria-hidden="true" />
        </span>
        <div className="check-in-banner__text">
          <p className="check-in-banner__title"><Trans>New sticker unlocked!</Trans></p>
          <p className="check-in-banner__subtitle"><Trans>Claim your weekly reward</Trans></p>
        </div>
        <img className="check-in-banner__chevron" src={chevronRight} width={16} height={16} alt="" aria-hidden="true" />
      </Link>
      <div className="check-in-wrapper">
        <div className="check-in-card">
          <img className="check-in-card__shapes" src={decorativeShapes} alt="" aria-hidden="true" />
          <div className="check-in-content">
            <h1><Trans>How is your body feeling today?</Trans></h1>
            <Link className="plus-button" to={ROUTES.words} aria-label={t`Start a check-in`}>
              <AddIcon />
            </Link>
          </div>
        </div>
      </div>
      <TabBar />
    </PageFrame>
  )
};
