import { component$, useSignal } from "@builder.io/qwik";
import { Section } from "./section";
import { SuccessCheckbox } from "./success";
import { getIsTheSameDay, getIsToday, getIsYesterday } from "~/utilities/date";
import type { Objective, Success } from "~/server/db/schema";

const PAST_DAYS_COUNT = 30;

const getNumberOfBoxes = ({
  duration,
  success,
  arePastModificationsAllowed,
}: {
  duration: number;
  success: Success[];
  arePastModificationsAllowed: boolean;
}) => {
  const now = new Date();
  const dates = success.map((s) => s.date);
  dates.sort((a, b) => a.getTime() - b.getTime());

  const lastDate = dates[dates.length - 1];
  const firstDate = dates[0] || now;
  const isTodayPassed = getIsToday(lastDate);

  const realPastDays = Math.ceil(
    (now.getTime() - firstDate.getTime()) / 86400000,
  );
  const pastDays = arePastModificationsAllowed
    ? Math.max(PAST_DAYS_COUNT, realPastDays)
    : realPastDays;
  const remainingDays = duration - success.length;
  const count = pastDays + remainingDays + (isTodayPassed ? 1 : 0);
  return { pastDaysCount: pastDays, boxesCount: count };
};

const getCheckboxes = ({
  success,
  boxesCount,
  pastDaysCount,
}: {
  success: Success[];
  boxesCount: number;
  pastDaysCount: number;
}) => {
  const now = new Date();
  return new Array(boxesCount).fill(0).map((_, i) => {
    const boxDate = new Date(now);
    boxDate.setDate(boxDate.getDate() - pastDaysCount + i);

    const daySuccess = success.find((s) => {
      return getIsTheSameDay(s.date, boxDate);
    });

    if (daySuccess) {
      return { date: boxDate, id: daySuccess.id, isPassed: true };
    }

    return { date: boxDate, id: i, isPassed: false };
  });
};

interface IProgressSection {
  objective: Objective & { success: Success[] };
}

export const ProgressSection = component$(({ objective }: IProgressSection) => {
  const pastModifications = useSignal(false);
  const arePastModificationsAllowed = pastModifications.value;
  const { duration, success } = objective;
  const { pastDaysCount, boxesCount } = getNumberOfBoxes({
    duration,
    success,
    arePastModificationsAllowed,
  });
  const checkboxes = getCheckboxes({ success, boxesCount, pastDaysCount });

  return (
    <Section title="Progress">
      <div class="flex flex-col items-center">
        <button
          class="ml-auto rounded-lg text-gray-400 text-sm py-1 px-2 hover:bg-grey-200 border"
          onClick$={() => {
            pastModifications.value = !arePastModificationsAllowed;
          }}
        >
          {arePastModificationsAllowed ? "Hide" : "Show"} past modifications
        </button>
        <div class="p-6 flex gap-4 flex-wrap">
          {checkboxes.map((s) => {
            const isToday = getIsToday(s.date);
            const isYesterday = getIsYesterday(s.date);
            const isInThePast =
              !isToday && s.date.getTime() < new Date().getTime();
            const isEditable =
              isToday ||
              isYesterday ||
              (arePastModificationsAllowed && isInThePast);

            return (
              <SuccessCheckbox
                key={s.date.toString()}
                isPassed={s.isPassed}
                isFailed={isInThePast && !s.isPassed}
                isEditable={isEditable}
                date={s.date}
                objectiveId={objective.id}
              />
            );
          })}
        </div>
      </div>
    </Section>
  );
});
