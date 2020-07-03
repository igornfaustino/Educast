// Breakpoints in pixels for limiting how many cards will be shown in Carousel.
export const responsive = {
	Yes: {
		breakpoint: {
			max: 10000, // pixels
			min: 2250,
		},
		items: 10, // amount of cards shown
	},
	FHDPlus: {
		breakpoint: {
			max: 2250,
			min: 2050,
		},
		items: 9,
	},
	FHD: {
		breakpoint: {
			max: 2050,
			min: 1850,
		},
		items: 8,
	},
	FHDMinus: {
		breakpoint: {
			max: 1850,
			min: 1650,
		},
		items: 7,
	},
	desktop: {
		breakpoint: {
			max: 1650,
			min: 1450,
		},
		items: 6,
	},
	HDPlus: {
		breakpoint: {
			max: 1450,
			min: 1250,
		},
		items: 5,
	},
	HDMinus: {
		breakpoint: {
			max: 1250,
			min: 1050,
		},
		items: 4,
	},
	tabletPlus: {
		breakpoint: {
			max: 1050,
			min: 850,
		},
		items: 3,
	},
	tabletMinus: {
		breakpoint: {
			max: 850,
			min: 650,
		},
		items: 2,
	},
	mobile: {
		breakpoint: {
			max: 650,
			min: 450,
		},
		items: 2,
	},
	mobileMinus: {
		breakpoint: {
			max: 450,
			min: 0,
		},
		items: 1,
	},
};
