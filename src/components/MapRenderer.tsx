"use client";

import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { geoData, numData } from "@/data/geo";

type MapProps = {
  counts: { [country: string]: number };
};

function getName(code: string): string {
  return numData.find((item) => item.code === code)?.name || "";
}

export default function MapRenderer({ counts }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const aspectRatio = 16 / 9;

  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setDimensions({
          width,
          height: width / aspectRatio,
        });
      }
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const projection = d3.geoMercator().fitExtent(
    [
      [4, 10],
      [dimensions.width - 4, dimensions.height - 10],
    ],
    geoData,
  );

  const geoPathGenerator = d3.geoPath().projection(projection);
  const filteredFeatures = geoData.features.filter(
    (shape) => shape.id !== "ATA",
  );
  const bounds = geoPathGenerator.bounds({
    type: "FeatureCollection",
    features: filteredFeatures,
  });
  const mapHeight = bounds[1][1] - bounds[0][1];
  const mapWidth = bounds[1][0] - bounds[0][0];
  const offsetX = (dimensions.width - mapWidth) / 2 - bounds[0][0];
  const offsetY = (dimensions.height - mapHeight) / 2 - bounds[0][1];
  const scale = 1.4;
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;

  const allSvgPaths = filteredFeatures.map((shape) => {
    const name = getName(shape.id);
    const regionData = counts[name];

    const className =
      regionData > 0
        ? "fill-teal-500 dark:fill-teal-400"
        : "fill-neutral-200 dark:fill-neutral-800";

    return (
      <path
        key={shape.id}
        d={geoPathGenerator(shape)}
        className={className}
        fillOpacity={1}
      />
    );
  });

  if (!dimensions.width) {
    return (
      <div
        ref={containerRef}
        className="bg-muted/40 aspect-[16/9] w-full rounded-[1.25rem]"
      />
    );
  }

  return (
    <div ref={containerRef} className="aspect-[16/9] w-full">
      <svg
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid meet"
        className="block h-full w-full stroke-neutral-400 dark:stroke-neutral-700"
      >
        <g
          transform={`translate(${centerX}, ${centerY}) scale(${scale}) translate(${-centerX + offsetX}, ${-centerY + offsetY})`}
        >
          {allSvgPaths}
        </g>
      </svg>
    </div>
  );
}
