import { Link } from "react-router-dom";
import { ROUTES } from "@/routes/paths";
import { PageFrame } from "@/shared/layout";
import { TabBar } from "@/shared/ui";
import { useUserProfile } from "@/entities/user-profile/useUserProfile";
import './CheckIn.css';

export const CheckIn = () => {
  const { name } = useUserProfile();

  return (
    <PageFrame>
      <div className="check-in-wrapper">
				<div className="check-in-content">
					<p className="check-in-greeting">Hi, {name}</p>
					<h1>What is your body telling you today?</h1>
        	<Link className="plus-button" to={ROUTES.words}>+</Link>
				</div>
        </div>
      <TabBar />
    </PageFrame>
  )
};
