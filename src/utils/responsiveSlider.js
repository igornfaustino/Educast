// Breakpoints in pixels for limiting how many cards will be shown in Carousel.
export const responsive = {
	Yes: {
		breakpoint: {
			max: 10000, // pixels
			min: 2240,
		},
		items: 10, // amount of cards shown
	},
	FHDPlus: {
		breakpoint: {
			max: 2240,
			min: 2040,
		},
		items: 9,
	},
	FHD: {
		breakpoint: {
			max: 2040,
			min: 1840,
		},
		items: 8,
	},
	FHDMinus: {
		breakpoint: {
			max: 1840,
			min: 1640,
		},
		items: 7,
	},
	desktop: {
		breakpoint: {
			max: 1640,
			min: 1440,
		},
		items: 6,
	},
	HDPlus: {
		breakpoint: {
			max: 1440,
			min: 1240,
		},
		items: 5,
	},
	HDMinus: {
		breakpoint: {
			max: 1240,
			min: 1040,
		},
		items: 4,
	},
	tabletPlus: {
		breakpoint: {
			max: 1040,
			min: 840,
		},
		items: 3,
	},
	tabletMinus: {
		breakpoint: {
			max: 840,
			min: 640,
		},
		items: 2,
	},
	mobile: {
		breakpoint: {
			max: 640,
			min: 420,
		},
		items: 2,
	},
	mobileMinus: {
		breakpoint: {
			max: 420,
			min: 0,
		},
		items: 1,
	},
};
