import stamen from './stamen.yml';
import edh from './edh-gl.yml';
import sf from './style-fluvial-gl.yml';
import ortho from './gpp-orthophoto.yml';

export const layers = {
	baselayers: [
		{ config: ortho, state:  { visible: true } },
		{ config: stamen, state: { visible: false } }
	],
	overlays: [
		{ config: sf, state: { visible: true, opacity: 0.8 }},
		{ config: edh, state: { visible: false, opacity: 0.8 }}
	]
};