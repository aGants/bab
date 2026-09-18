import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes/paths";
import { PageFrame } from "@/shared/layout";
import { checkInRepository } from "@/entities/check-in/checkInRepository";
import { useTodayDailyLog } from "@/entities/daily-log/useTodayDailyLog";
import { todayKey } from "@/shared/lib/dateKey";
import type { CheckInEntry } from "@/entities/check-in/types";
import { CATEGORIES, WORD_CARDS } from "@/features/word-field/bodyWordsData";
import './CheckIn.css';

export const CheckIn = () => {
  const [entries, setEntries] = useState<CheckInEntry[]>([]);
  const { hadPeriod, tookPainkiller } = useTodayDailyLog();

  useEffect(() => {
    checkInRepository.getByDate(todayKey()).then(setEntries);
  }, []);

  return (
    <PageFrame>
      <div className="check-in-wrapper">
				<div className="check-in-content">
					<h1>What is your body telling you today?</h1>
        	<Link className="plus-button" to={ROUTES.words}>+</Link>
				</div>

        {(hadPeriod || tookPainkiller) && (
          <div className="check-in-day-flags">
            {hadPeriod && <span className="check-in-day-flag">🩸 On period</span>}
            {tookPainkiller && <span className="check-in-day-flag">💊 Took a painkiller</span>}
          </div>
        )}

        {entries.length > 0 && (
          <ul className="check-in-log">
            {entries.map((entry) => {
              const word = WORD_CARDS.find((card) => card.id === entry.wordId);
              return (
                <li key={entry.id} className="check-in-log-item">
                  <span className="check-in-log-emoji">
                    {word ? CATEGORIES[word.category].emoji : '❓'}
                  </span>
                  <div className="check-in-log-details">
                    <strong>{word?.word ?? 'Unknown'}</strong>
                    <span className="check-in-log-meta">
                      {entry.bodyZone} · intensity {entry.intensity}
                    </span>
                    {entry.note && <p className="check-in-log-note">{entry.note}</p>}
                  </div>
                  <time className="check-in-log-time">
                    {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </time>
                </li>
              );
            })}
          </ul>
        )}
        </div>
    </PageFrame>
  )
};
