import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export function ShareIcon({ size = 24, color = '#000' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="18" cy="5" r="3" stroke={color} strokeWidth={1.75} />
      <Circle cx="6" cy="12" r="3" stroke={color} strokeWidth={1.75} />
      <Circle cx="18" cy="19" r="3" stroke={color} strokeWidth={1.75} />
      <Path
        d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
