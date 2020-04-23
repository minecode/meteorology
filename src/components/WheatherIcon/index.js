import React from 'react';
import {
	WiDaySunny,
	WiDayCloudy,
	WiDayCloudyHigh,
	WiDayShowers,
	WiDayRain,
	WiDayRainMix,
	WiDayHaze,
	WiDayFog,
	WiDaySnow,
	WiDayLightning,
	WiDayHail,
	WiDayThunderstorm,
	WiDaySleet,
	WiCloudy,
	WiFog,
} from 'weather-icons-react';

export default function WheatherIcon({ wheatherIcon }) {
	switch (wheatherIcon) {
		case -99 || 0 || 1:
			return <WiDaySunny size={50} />;
		case 2 || 3 || 4:
			return <WiDayCloudy size={50} />;
		case 5:
			return <WiDayCloudyHigh size={50} />;
		case 6 || 7 || 8:
			return <WiDayShowers size={50} />;
		case 9 || 10 || 11:
			return <WiDayRain size={50} />;
		case 12 || 13 || 14:
			return <WiDayRainMix size={50} />;
		case 15:
			return <WiDayRain size={50} />;
		case 16:
			return <WiDayHaze size={50} />;
		case 17:
			return <WiDayFog size={50} />;
		case 18:
			return <WiDaySnow size={50} />;
		case 19:
			return <WiDayLightning size={50} />;
		case 20 || 23:
			return <WiDayThunderstorm size={50} />;
		case 21:
			return <WiDaySleet size={50} />;
		case 22:
			return <WiDayHail size={50} />;
		case 24:
			return <WiCloudy size={50} />;
		case 25:
			return <WiDayCloudy size={50} />;
		case 26 || 27:
			return <WiFog size={50} />;
		default:
			return <WiDaySunny size={50} />;
	}
}
