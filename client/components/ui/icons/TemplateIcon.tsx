import React from 'react';
import Svg, { Rect } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export function TemplateIcon({ size = 24, color = '#000' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="3"
        y="3"
        width="18"
        height="7"
        rx="1.5"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1.5"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1.5"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
