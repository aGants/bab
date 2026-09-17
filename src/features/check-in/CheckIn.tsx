import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { WordCard } from "../word-field/bodyWordsData";
import { ROUTES } from "@/routes/paths";
import { PageFrame } from "@/shared/layout/PageFrame";
import './CheckIn.css';

export const CheckIn = () => {
  const [selected, setSelected] = useState<WordCard | null>(null)

  useEffect(() => {
  }), [];

  return (
    <PageFrame>
      <div className="check-in-wrapper">
        <div style={{ height: '50px' }}>space for mini calendar </div>
				<div className="check-in-content">
					<h1>What is your body telling you today?</h1>
        	<Link className="plus-button" to={ROUTES.words}>+</Link>
				</div>
        </div>
    </PageFrame>
  )
};
