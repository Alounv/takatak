/** @jsxImportSource react */

import { BarChart, Bar, YAxis, Tooltip } from "recharts";
import { qwikify$ } from "@builder.io/qwik-react";

const ReactChart = ({
  data,
}: {
  data: { x: string; v: number; nv: number }[];
}) => {
  return (
    <div className="flex justify-center">
      <BarChart
        width={800}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <YAxis />
        <Tooltip />
        <Bar dataKey="nv" fill="#f17eb8" stackId="a" />
        <Bar dataKey="v" fill="#32a8e9" stackId="a" />
      </BarChart>
    </div>
  );
};

export const Chart = qwikify$(ReactChart);
