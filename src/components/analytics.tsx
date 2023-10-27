import { component$ } from "@builder.io/qwik";

export const Analytics = component$(
  ({
    wordsRepartition,
    pastWordsRepartition,
  }: {
    wordsRepartition: Repartition | undefined;
    pastWordsRepartition: Repartition | undefined;
  }) => {
    return (
      <div class="flex flex-col gap-2">
        {pastWordsRepartition && (
          <Progress repartition={pastWordsRepartition} title={`6 h ago`} />
        )}
        {wordsRepartition && (
          <Progress repartition={wordsRepartition} title={`Current`} />
        )}
        <Categories
          wordsRepartition={wordsRepartition}
          pastWordsRepartition={pastWordsRepartition}
        />
      </div>
    );
  },
);

export interface Repartition extends Record<string, number> {
  total: number;
  validated: number;
  remaining: number;
}

const Progress = ({
  title,
  repartition,
}: {
  repartition: Repartition;
  title: string;
}) => {
  const categories = getCategories(repartition);
  return (
    <div class="flex items-center gap-4">
      <div class="text-sm w-20 font-medium">{title}</div>
      <div class="flex w-full my-3 gap-1">
        {categories.map(({ key, color, percent, count }, i) => {
          return (
            <div
              key={key}
              class={`flex flex-col rounded-sm h-3 ${color} transition-all`}
              style={{ width: `${percent}%` }}
              title={`${key}: ${count}`}
            >
              {count > 0 && (
                <span
                  class={`text-xs pl-1 absolute ${
                    i % 2 === 0 ? "translate-y-4" : "-translate-y-4"
                  }`}
                >
                  {count}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Categories = ({
  wordsRepartition,
  pastWordsRepartition,
}: {
  wordsRepartition: Repartition | undefined;
  pastWordsRepartition: Repartition | undefined;
}) => {
  const categories = getCategories(wordsRepartition);
  const total = wordsRepartition?.["total"] || 1;
  let maximumDiff = 0;

  const categoriesWithDiff = categories
    .filter((c) => c.key !== "remaining")
    .map((c) => {
      const diff = c.count - (pastWordsRepartition?.[c.key as "total"] || 0);
      maximumDiff = Math.max(maximumDiff, diff);
      return { ...c, diff };
    });

  const maxDenominator = Math.min(1000, total);
  const denominator = Math.max(maxDenominator, maximumDiff);

  return (
    <div class="mt-3 flex flex-col gap-3">
      <div class="text-sm font-medium">Progress since 24 h</div>
      <div class="text-gray-400 flex flex-col gap-1">
        {pastWordsRepartition &&
          categoriesWithDiff.map(({ key, color, diff }) => {
            const percentShown = ((diff / denominator) * 100).toFixed(0);
            const percent = ((diff / total) * 100).toFixed(0);
            return (
              <div key={key} class="flex gap-3">
                <div class="text-xs w-24 text-right">
                  {key === "validated" ? "✅ validated" : `typed ${key} times`}
                </div>
                <div
                  class={`h-3 w-3 ${color} rounded transition-all`}
                  style={{ width: percentShown + "%" }}
                />
                <div class="text-xs text-black dark:text-white">
                  <strong>{diff}</strong> ({percent}%)
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

const getCategoryColor = (k: string) => {
  if (k === "validated") return "bg-sky-500";
  if (k === "remaining") return "bg-gray-200 dark:bg-gray-800";

  const parsed = parseInt(k);
  if (parsed >= 0) return `bg-pink-${parsed + 1}00`;
};

const getCategories = (repartition: Repartition | undefined) => {
  if (!repartition) return [];

  return Object.entries(repartition || {})
    .filter(([k]) => k !== "total")
    .map(([k, v]) => {
      const color = getCategoryColor(k);
      const percent = ((v / (repartition?.total || 1)) * 100).toFixed(0);
      return { key: k, count: v, color, percent };
    });
};

// bg-pink-100
// bg-pink-200
// bg-pink-300
// bg-pink-400
// bg-pink-500
// bg-pink-600
// bg-pink-700
// bg-pink-800
// bg-pink-900
