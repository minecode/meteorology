import React from 'react';

import {
	WiDirectionUp,
	WiDirectionDown,
	WiDirectionDownLeft,
	WiDirectionDownRight,
	WiDirectionLeft,
	WiDirectionRight,
	WiDirectionUpLeft,
	WiDirectionUpRight,
} from 'react-icons/wi';

export default function WheatherWinDirIcon({ wheatherWinDir }) {
	switch (wheatherWinDir) {
		case 'N':
			return <WiDirectionUp size={40} />;
		case 'NE':
			return <WiDirectionUpRight size={40} />;
		case 'E':
			return <WiDirectionRight size={40} />;
		case 'SE':
			return <WiDirectionDownRight size={40} />;
		case 'S':
			return <WiDirectionDown size={40} />;
		case 'SW':
			return <WiDirectionDownLeft size={40} />;
		case 'W':
			return <WiDirectionLeft size={40} />;
		case 'NW':
			return <WiDirectionUpLeft size={40} />;
		default:
			return <WiDirectionUp size={40} />;
	}
}
